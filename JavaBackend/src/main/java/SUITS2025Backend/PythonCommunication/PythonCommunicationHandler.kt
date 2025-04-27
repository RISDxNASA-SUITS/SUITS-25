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
data class returnData(val data:Float)
data class lidarReturn(val data:List<Float>);
sealed class RoverCommand {
    open fun communicate(): Any {
        throw NotImplementedError("communicate() not implemented")
    }

    open fun communicate(input: Float): Any {
        return communicate()
    }


    fun makeSendCommandPacket(commandNumber: Int, input: Float): ByteBuffer {
        val buffer = ByteBuffer.allocate(12);
        buffer.order(ByteOrder.BIG_ENDIAN)
        val timeStamp = Date().time.toInt()
        buffer.putInt(timeStamp);
        buffer.putInt(commandNumber);
        buffer.putFloat(input);
        return buffer;
    }

    fun makeSendLidarPacket(commandNumber: Int): ByteBuffer {
        val buffer = ByteBuffer.allocate(8);
        buffer.order(ByteOrder.BIG_ENDIAN)
        val timeStamp = Date().time.toInt()
        buffer.putInt(timeStamp);
        buffer.putInt(commandNumber);
        return buffer;
    }

    fun sendMessageNoReturn(sendPacket:ByteBuffer) {
        val socket = DatagramSocket()
        val ip = System.getenv("IP") ?: "127.0.0.1"
        val port = System.getenv("PORT") ?: "14141"
        val address = InetAddress.getByName(ip)
        val bytes = sendPacket.array()
        val packet = DatagramPacket(bytes, bytes.size, address, port.toInt())
        socket.send(packet);
    }
    fun <T> sendMessage(sendPacket: ByteBuffer, recvBuffer: ByteBuffer, callBack: (ByteBuffer) -> T, toReturn: Boolean =true): T {
        val socket = DatagramSocket()
        val ip = System.getenv("IP") ?: "127.0.0.1"
        val port = System.getenv("PORT") ?: "14141"
        val address = InetAddress.getByName(ip)
        val bytes = sendPacket.array()
        val packet = DatagramPacket(bytes, bytes.size, address, port.toInt())
        socket.send(packet);

        val recvPacket = DatagramPacket(recvBuffer.array(), recvBuffer.array().size)
        socket.receive(recvPacket)
        println("Received packet length: ${recvPacket.length}")
        val toCallback = ByteBuffer.wrap(recvPacket.data, 0, recvPacket.length)
        toCallback.getInt() // Timestamp
        toCallback.getInt() // Command No.
        return callBack(toCallback);

    }

    data object Lidar : RoverCommand() {
        override fun communicate(): List<Float> {
            val returnList:MutableList<Float> = mutableListOf()
            (167..179).map {
                val recvBuffer = ByteBuffer.allocate(104)
                recvBuffer.order(ByteOrder.BIG_ENDIAN)
                val sendPacket = makeSendLidarPacket(it);
                val callBack: (ByteBuffer) -> Float = { buff: ByteBuffer ->

                    buff.getFloat()
                }
                returnList.add(sendMessage(sendPacket,recvBuffer,callBack))
            };



            return returnList;


        }
    }

    data object Telemetry : RoverCommand() {
        override fun communicate(): PrTelemetry {
            val retList:MutableList<String> = mutableListOf()
            (119..164).forEach {
                val recvBuffer = ByteBuffer.allocate(104)
                val sendPacket = makeSendLidarPacket(it);
                val callBack: (ByteBuffer) -> String = { buff: ByteBuffer ->
                    buff.getFloat().toString()
                }
                retList.add(sendMessage(sendPacket,recvBuffer,callBack))
            }

        return PrTelemetry.fromStringList(retList);
        }
    }

    data object Brakes : RoverCommand() {
        override fun communicate(brakeInput: Float): Int {
            val commandNum = 1107
            val sendPacket = makeSendCommandPacket(commandNum, brakeInput)

            sendMessageNoReturn(sendPacket)
            return 1;
        }
    }

    data object Throttle : RoverCommand() {
        override fun communicate(throttleInput: Float): Int {
            val commandNum = 1109
            val sendPacket = makeSendCommandPacket(commandNum, throttleInput)

            sendMessageNoReturn(sendPacket)
            return 1

        }
    }

    object Steering : RoverCommand() {
        override fun communicate(input: Float): Float {
            val commandNum = 1110
            val sendPacket = makeSendCommandPacket(commandNum, input)

            sendMessageNoReturn(sendPacket);
            return 1.0f
        }
    }
}

    /**
     * Communication
     *
     * This section handles rover communication commands including:
     * - Telemetry: Gets rover telemetry data (command 120)
     * - Brakes: Controls rover brakes (command 1107)
     * - Throttle: Controls rover throttle (command 1109)
     * - Steering: Controls rover steering (command 1110)
     */

    data class BrakesRequest(val brakeInput: Float)
    data class ThrottleRequest(val throttleInput: Float)
    data class SteeringRequest(val steeringInput: Float)


    object PythonCommunicationHandler {
        @JvmStatic
        fun setup(app: Javalin) {
            app.get("/lidar", this::getLidar)
            app.post("/brakes", this::postBrakes)
            app.post("/throttle", this::postThrottle)
            app.post("/steering", this::postSteering)
            app.get("/telemetry", this::getTelem)
        }

        private fun getLidar(ctx: Context) {
            val lidar = RoverCommand.Lidar.communicate()

            ctx.json(lidarReturn(lidar))
        }

        private fun postBrakes(ctx: Context) {
            val brakes = RoverCommand.Brakes.communicate(ctx.bodyAsClass(BrakesRequest::class.java).brakeInput)
            ctx.json(brakes)
        }

        private fun postThrottle(ctx: Context) {
            val throttle = RoverCommand.Throttle.communicate(ctx.bodyAsClass(ThrottleRequest::class.java).throttleInput)
            ctx.json(throttle)
        }

        private fun postSteering(ctx: Context) {
            val steering = RoverCommand.Steering.communicate(ctx.bodyAsClass(SteeringRequest::class.java).steeringInput)
            ctx.json(steering)
        }
        private fun getTelem(ctx: Context) {
            ctx.json(RoverCommand.Telemetry.communicate())
        }


    }

