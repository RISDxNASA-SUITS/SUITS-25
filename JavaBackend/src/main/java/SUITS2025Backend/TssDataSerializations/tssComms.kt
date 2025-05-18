package SUITS2025Backend.TssDataSerializations
import io.javalin.Javalin
import io.javalin.http.Context
import SUITS2025Backend.TSSCommunication
import SUITS2025Backend.PythonCommunication.PythonCommunicationHandler
import java.nio.ByteBuffer
import java.nio.ByteOrder


enum class Battery { LOCAL, UMB }
enum class Oxygen { SEC, PRI }
enum class Comms { B, A }
enum class Fan { SEC, PRI }
enum class Pump { CLOSE, OPEN }
enum class CO2 { B, A }

data class DcuState(
    val battery: Battery,
    val oxygen: Oxygen,
    val comms: Comms,
    val fan: Fan,
    val pump: Pump,
    val co2: CO2
) {
    companion object {
        fun fromIntArray(values: List<Int>): DcuState {
            require(values.size == 6) { "Expected 6 values, got ${values.size}" }
            return DcuState(
                battery = Battery.values()[values[0]],
                oxygen = Oxygen.values()[values[1]],
                comms = Comms.values()[values[2]],
                fan = Fan.values()[values[3]],
                pump = Pump.values()[values[4]],
                co2 = CO2.values()[values[5]]
            )
        }
    }
}

data class ErrorState(
    val fan_error: Boolean,
    val oxy_error: Boolean,
    val pump_error: Boolean
) {
    companion object {
        fun fromIntArray(values: IntArray): ErrorState {
            require(values.size == 3) { "Expected 3 values, got ${values.size}" }
            return ErrorState(
                fan_error = values[0] == 1,
                oxy_error = values[1] == 1,
                pump_error = values[2] == 1
            )
        }
    }
}

data class IMUState(
    val posx: Float,
    val posy: Float,
    val heading: Float
) {
    companion object {
        fun fromDoubleArray(values: List<Float>): IMUState {
            require(values.size == 3) { "Expected 3 values, got ${values.size}" }
            return IMUState(
                posx = values[0],
                posy = values[1],
                heading = values[2]
            )
        }
    }
}

data class UIAState(
    val eva1_power: Boolean,
    val eva1_oxy: Boolean,
    val eva1_water_supply: Boolean,
    val eva1_water_waste: Boolean,
    val eva2_power: Boolean,
    val eva2_oxy: Boolean,
    val eva2_water_supply: Boolean,
    val eva2_water_waste: Boolean,
    val oxy_vent: Boolean,
    val depress: Boolean
) {
    companion object {
        fun fromIntArray(values: IntArray): UIAState {
            require(values.size == 10) { "Expected 10 values, got ${values.size}" }
            return UIAState(
                eva1_power = values[0] == 1,
                eva1_oxy = values[1] == 1,
                eva1_water_supply = values[2] == 1,
                eva1_water_waste = values[3] == 1,
                eva2_power = values[4] == 1,
                eva2_oxy = values[5] == 1,
                eva2_water_supply = values[6] == 1,
                eva2_water_waste = values[7] == 1,
                oxy_vent = values[8] == 1,
                depress = values[9] == 1
            )
        }
    }
}

data class RoverState(
    val posx: Float,
    val posy: Float,
    val poi_1_x: Float,
    val poi_1_y: Float,
    val poi_2_x: Float,
    val poi_2_y: Float,
    val poi_3_x: Float,
    val poi_3_y: Float,
    val ping: Boolean
) {
    companion object {
        fun fromArrays(doubles: List<Float>, bools: List<Boolean>): RoverState {
            require(doubles.size == 8) { "Expected 8 float values, got ${doubles.size}" }
            require(bools.size == 1) { "Expected 1 boolean value, got ${bools.size}" }
            return RoverState(
                posx = doubles[0],
                posy = doubles[1],
                poi_1_x = doubles[2],
                poi_1_y = doubles[3],
                poi_2_x = doubles[4],
                poi_2_y = doubles[5],
                poi_3_x = doubles[6],
                poi_3_y = doubles[7],
                ping = bools[0]
            )
        }
    }
}

data class TelemetryState(
    val time: Float,
    val batt_time_left: Float,
    val oxy_pri_storage: Float,
    val oxy_sec_storage: Float,
    val oxy_pri_pressure: Float,
    val oxy_sec_pressure: Float,
    val oxy_time_left: Int,
    val heart_rate: Float,
    val oxy_consumption: Float,
    val co2_production: Float,
    val suit_pressure_oxy: Float,
    val suit_pressure_co2: Float,
    val suit_pressure_other: Float,
    val suit_pressure_total: Float,
    val fan_pri_rpm: Float,
    val fan_sec_rpm: Float,
    val helmet_pressure_co2: Float,
    val scrubber_a_co2_storage: Float,
    val scrubber_b_co2_storage: Float,
    val temperature: Float,
    val coolant_ml: Float,
    val coolant_gas_pressure: Float,
    val coolant_liquid_pressure: Float
) {
    companion object {
        fun fromArrays(floats: List<Float>, ints: List<Int>): TelemetryState {
            require(floats.size == 22) { "Expected 22 float values, got ${floats.size}" }
            require(ints.size == 1) { "Expected 1 int value, got ${ints.size}" }
            return TelemetryState(
                time = floats[0],
                batt_time_left = floats[1],
                oxy_pri_storage = floats[2],
                oxy_sec_storage = floats[3],
                oxy_pri_pressure = floats[4],
                oxy_sec_pressure = floats[5],
                oxy_time_left = ints[0],
                heart_rate = floats[6],
                oxy_consumption = floats[7],
                co2_production = floats[8],
                suit_pressure_oxy = floats[9],
                suit_pressure_co2 = floats[10],
                suit_pressure_other = floats[11],
                suit_pressure_total = floats[12],
                fan_pri_rpm = floats[13],
                fan_sec_rpm = floats[14],
                helmet_pressure_co2 = floats[15],
                scrubber_a_co2_storage = floats[16],
                scrubber_b_co2_storage = floats[17],
                temperature = floats[18],
                coolant_ml = floats[19],
                coolant_gas_pressure = floats[20],
                coolant_liquid_pressure = floats[21]
            )
        }
    }
}

data class SpecState(
    val id:Int,
    val sio2: Int,
    val al2o3: Int,
    val mno: Int,
    val cao: Int,
    val p2o3: Int,
    val tio2: Int,
    val feo: Int,
    val mgo: Int,
    val k2o: Int,
    val other: Int
) {
    companion object {
        fun fromIntArray(values: IntArray): SpecState {
            require(values.size == 11, { "Expected 10 values, got ${values.size}" })
            val specState = SpecState(
                id = values[0],
                sio2 = values[1],
                al2o3 = values[2],
                mno = values[3],
                cao = values[4],
                p2o3 = values[5],
                tio2 = values[6],
                feo = values[7],
                mgo = values[8],
                k2o = values[9],
                other = values[10]
            )
            require(specState.sio2 + specState.al2o3 + specState.mno + specState.cao + specState.p2o3 +
                    specState.tio2 + specState.feo + specState.mgo + specState.k2o + specState.other == 100) {
                "Sum of components must be 100%"
            }
            return specState
        }
    }
}

data class MissionState(
    val started: Boolean,
    val paused: Boolean,
    val completed: Boolean,
    val total_time: Int,
    val uia_started: Boolean,
    val uia_completed: Boolean,
    val uia_time: Int,
    val dcu_started: Boolean,
    val dcu_completed: Boolean,
    val dcu_time: Int,
    val rover_started: Boolean,
    val rover_completed: Boolean,
    val rover_time: Int,
    val spec_started: Boolean,
    val spec_completed: Boolean,
    val spec_time: Int
) {
    companion object {
        fun fromIntArray(values: List<Int>): MissionState {
            require(values.size == 16) { "Expected 16 values, got ${values.size}" }
            return MissionState(
                started = values[0] == 1,
                paused = values[1] == 1,
                completed = values[2] == 1,
                total_time = values[3],
                uia_started = values[4] == 1,
                uia_completed = values[5] == 1,
                uia_time = values[6],
                dcu_started = values[7] == 1,
                dcu_completed = values[8] == 1,
                dcu_time = values[9],
                rover_started = values[10] == 1,
                rover_completed = values[11] == 1,
                rover_time = values[12],
                spec_started = values[13] == 1,
                spec_completed = values[14] == 1,
                spec_time = values[15]
            )
        }
    }
}

object TssComms {
    val tss = TSSCommunication()
    val tssKt = PythonCommunicationHandler
    @JvmStatic
    fun setup(app:Javalin){
        app.get("/dcu/1", this::getEv1DcuState)
        app.get("/dcu/2", this::getEv2DcuState)
        app.get("/error", this::getErrorState)
        app.get("/imu/1", this::getEv1IMUState)
        app.get("/imu/2", this::getEv2IMUState)
        app.get("/rover", this::getRoverState)
        app.get("/uia", this::getUIAState)
        app.get("/ev-telemetry/1", this::getEv1Telemetry)
        app.get("/ev-telemetry/2", this::getEv2Telemetry)
        app.get("/evaStates", this::getMissionState)
        app.get("/spec/1", this::getSpecState)
        app.get("/spec/2", this::getSpec2State)

        return;
    }

    fun getEv1DcuState(ctx: Context) {
        var dcu = (2..7).map{
            val pkt = tssKt.makeSendLidarPacket(it)
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getInt()
            })
        }
        val dcuState = DcuState.fromIntArray(dcu)
        ctx.json(dcuState)
    }

    fun getEv2DcuState(ctx: Context) {
        var dcu = (8..13).map{
            val pkt = tssKt.makeSendLidarPacket(it)
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getInt()
            })
        }
        var dcuState = DcuState.fromIntArray(dcu)
        ctx.json(dcuState)
    }

    fun getErrorState(ctx: Context) {
        val errorState = ErrorState.fromIntArray(tss.getERRORStates())
        ctx.json(errorState)
    }

    fun getEv1IMUState(ctx: Context) {
        val doubles = (17..19).map {
            val pkt = tssKt.makeSendLidarPacket(it)
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        } // DO NOTE CHANGE
        
        val imuState = IMUState.fromDoubleArray(doubles)
        ctx.json(imuState)
    }

    fun getEv2IMUState(ctx: Context) {
        val doubles = (17..19).map {
            val pkt = tssKt.makeSendLidarPacket(it)
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        } // DO NOT CHANGE
        val imuState = IMUState.fromDoubleArray(doubles)
        ctx.json(imuState)
    }

    fun getUIAState(ctx: Context) {
        val uiaState = UIAState.fromIntArray(tss.getUIAStates())
        ctx.json(uiaState)
    }


    fun getRoverState(ctx: Context) {
        val doubles = (23..30).map {
            val pkt = tssKt.makeSendLidarPacket(it)
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        }
        val bools = arrayOf(31).map {
            val pkt = tssKt.makeSendLidarPacket(it)
            val recvBuffer = ByteBuffer.allocate(104)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getInt() == 1
            })
        }
        val roverState = RoverState.fromArrays(doubles, bools)
        ctx.json(roverState)
    }

    fun getEv1Telemetry(ctx: Context) {
        val floats = (63..68).map {
            val pkt = tssKt.makeSendCommandPacket(it, 2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        }
        val singleInt = listOf(69).map{
            val pkt = tssKt.makeSendCommandPacket(it, 2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getInt()
            })
        }
        val restFloats = (70..85).map {
            val pkt = tssKt.makeSendCommandPacket(it, 2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        }
        val telemetryState = TelemetryState.fromArrays(floats + restFloats, singleInt)
        ctx.json(telemetryState)
    }

    fun getEv2Telemetry(ctx: Context) {
        val pkt = tssKt.makeSendCommandPacket(63, 2.0f)
        val recvBuffer = ByteBuffer.allocate(200)
        recvBuffer.order(ByteOrder.BIG_ENDIAN)
        val time = tssKt.sendMessage(pkt, recvBuffer, { buff ->
            buff.getFloat()
        })
        val floats = (86..91).map {
            val pkt = tssKt.makeSendCommandPacket(it, 2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        }
        val singleInt = listOf(93).map{
            val pkt = tssKt.makeSendCommandPacket(it,2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getInt()
            })
        }
        val restFloats = (94..107).map {
            val pkt = tssKt.makeSendCommandPacket(it, 2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getFloat()
            })
        }
        val telemetryState = TelemetryState.fromArrays(listOf(time) + floats + restFloats, singleInt)
        ctx.json(telemetryState)
    }




    fun getSpecState(ctx: Context) {
        val specState = SpecState.fromIntArray(tss.getEVA2SPECStates())
        ctx.json(specState)
    }
    fun getSpec2State(ctx: Context) {
        val specState = SpecState.fromIntArray(tss.getEVA2SPECStates())
        ctx.json(specState)
    }


    fun getMissionState(ctx: Context) {
        val missionStateList = (108..123).map {
            val pkt = tssKt.makeSendCommandPacket(it, 2.0f)
            val recvBuffer = ByteBuffer.allocate(200)
            recvBuffer.order(ByteOrder.BIG_ENDIAN)
            tssKt.sendMessage(pkt, recvBuffer, { buff ->
                buff.getInt()
            })
        }
        val missionState = MissionState.fromIntArray(missionStateList)
        ctx.json(missionState)
    }


}