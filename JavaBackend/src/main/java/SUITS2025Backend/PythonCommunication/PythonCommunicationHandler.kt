package SUITS2025Backend.PythonCommunication

import PrTelemetry
import io.javalin.Javalin
import io.javalin.http.Context
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.*
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import org.jetbrains.exposed.sql.transactions.transaction
import SUITS2025Backend.db.*
data class returnData(val data:Float)
data class lidarReturn(val data:List<Float>)


object PythonCommunicationHandler {
    private const val LIDAR_CMD = 172
    private const val BRAKE_CMD = 1107
    private const val THROTTLE_CMD = 1109
    private const val STEERING_CMD = 1110
    private const val HEADLIGHT_CMD = 1106
    val bgScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    
    data class Position(val x: Float, val y: Float)

    @JvmStatic
    fun setup(app: Javalin) {   
        val channel = Channel<Position>()
        println("WE ARE SETTING UP")
        bgScope.launch {
            var lastXY = Position(1f, 0f)
            

            while(true){
                val telem:PrTelemetry = getTelemetry();
                val newPos = Position(telem.currentPosX, telem.currentPosY)
                println(newPos)
                if (newPos != lastXY){
                    channel.send(newPos)
                    lastXY = newPos
                }
                delay(10_000)
            }
        }

        bgScope.launch {
            while(true){
                val pos = channel.receive()
                println("WE HVAE RECEVIED $pos")
                transaction {
                    Poi.new {
                        name = "breadCrumb"
                        x = pos.x.toDouble()
                        y = pos.y.toDouble()
                        tags = ""
                        description = ""
                        type = "breadCrumb"
                    }
                }

                
            }
        }
        app.get("/lidar", this::getLidar)
        app.post("/brakes", this::postBrakes)
        app.post("/throttle", this::postThrottle)
        app.post("/steering", this::postSteering)
        app.get("/telemetry", this::getTelem)
        app.post("/headlights", this::postHeadlights)
    }

    fun makeSendCommandPacket(commandNumber: Int, input: Float): ByteBuffer {
        val buffer = ByteBuffer.allocate(12)
        buffer.order(ByteOrder.BIG_ENDIAN)
        val timeStamp = Date().time.toInt()
        buffer.putInt(timeStamp)
        buffer.putInt(commandNumber)
        buffer.putFloat(input)
        return buffer
    }

    fun makeSendLidarPacket(commandNumber: Int): ByteBuffer {
        val buffer = ByteBuffer.allocate(8)
        buffer.order(ByteOrder.BIG_ENDIAN)
        val timeStamp = Date().time.toInt()
        buffer.putInt(timeStamp)
        buffer.putInt(commandNumber)
        return buffer
    }

   fun sendMessageNoReturn(sendPacket: ByteBuffer) {
        val socket = DatagramSocket()
        val ip = "127.0.0.1"
        // val ip =  "192.168.51.110"
        val port = System.getenv("PORT") ?: "14141"
        val address = InetAddress.getByName(ip)
        val bytes = sendPacket.array()
        val packet = DatagramPacket(bytes, bytes.size, address, port.toInt())
        socket.send(packet)
    }

   fun <T> sendMessage(sendPacket: ByteBuffer, recvBuffer: ByteBuffer, callBack: (ByteBuffer) -> T): T {
        val socket = DatagramSocket()
        // val ip =  "192.168.51.110"
        val ip = "127.0.0.1"
        val port = System.getenv("PORT") ?: "14141"
        val address = InetAddress.getByName(ip)
        val bytes = sendPacket.array()
        val packet = DatagramPacket(bytes, bytes.size, address, port.toInt())
        
        socket.send(packet)

        val recvPacket = DatagramPacket(recvBuffer.array(), recvBuffer.array().size)
        socket.receive(recvPacket)
        
        val toCallback = ByteBuffer.wrap(recvPacket.data, 0, recvPacket.length)
        toCallback.getInt() // Timestamp
        toCallback.getInt() // Command No.
        return callBack(toCallback)
    }

    fun getLidar(): List<Float> {
        return (arrayOf(LIDAR_CMD)).map {
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            val sendPacket = makeSendLidarPacket(it)
            val callBack: (ByteBuffer) -> List<Float> = { buff: ByteBuffer ->
                (1..13).map {
                    
                    
                    buff.getFloat()
                }
            }
            sendMessage(sendPacket, recvBuffer, callBack)
        }.flatten()
    }

    fun getTelemetry(): PrTelemetry {
        val retList: MutableList<String> = mutableListOf()
        (124..172).forEach {
            val recvBuffer = ByteBuffer.allocate(104)
            val sendPacket = makeSendLidarPacket(it)
            val callBack: (ByteBuffer) -> String = { buff: ByteBuffer ->
                // Thread.sleep(500)
                var l = buff.getFloat()
                
                l.toString()
            }
            retList.add(sendMessage(sendPacket, recvBuffer, callBack))
        }
        return PrTelemetry.fromStringList(retList)
    }

    fun setBrakes(brakeInput: Float): Int {
        val sendPacket = makeSendCommandPacket(BRAKE_CMD, brakeInput)
        sendMessageNoReturn(sendPacket)
        return 1
    }

    fun setThrottle(throttleInput: Float): Int {
        val sendPacket = makeSendCommandPacket(THROTTLE_CMD, throttleInput)
        sendMessageNoReturn(sendPacket)
        return 1
    }

    fun setSteering(input: Float): Float {
        val sendPacket = makeSendCommandPacket(STEERING_CMD, input)
        sendMessageNoReturn(sendPacket)
        return 1.0f
    }
    fun setHeadlights(input: Float): Float {
        val sendPacket = makeSendCommandPacket(HEADLIGHT_CMD, input)
        sendMessageNoReturn(sendPacket)
        return 1.0f
    }

    // HTTP endpoint handlers
    private fun getLidar(ctx: Context) {
        val lidar = getLidar()
        ctx.json(lidarReturn(lidar))
    }

    private fun postBrakes(ctx: Context) {
        val brakes = setBrakes(ctx.bodyAsClass(BrakesRequest::class.java).brakeInput)
        ctx.json(brakes)
    }

    private fun postThrottle(ctx: Context) {
        val throttle = setThrottle(ctx.bodyAsClass(ThrottleRequest::class.java).throttleInput)
        ctx.json(throttle)
    }

    private fun postSteering(ctx: Context) {
        val steering = setSteering(ctx.bodyAsClass(SteeringRequest::class.java).steeringInput)
        ctx.json(steering)
    }

    private fun getTelem(ctx: Context) {
        ctx.json(getTelemetry())
    }
    
    private fun postHeadlights(ctx: Context) {
        val headlights = setHeadlights(ctx.bodyAsClass(HeadlightsRequest::class.java).input)
        ctx.json(headlights)
    }
}

data class BrakesRequest(val brakeInput: Float)
data class ThrottleRequest(val throttleInput: Float)
data class SteeringRequest(val steeringInput: Float)
data class HeadlightsRequest(val input: Float)

