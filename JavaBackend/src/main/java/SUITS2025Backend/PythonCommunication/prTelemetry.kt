data class PrTelemetry(
    var acHeating: Boolean,
    var acCooling: Boolean,
    var co2Scrubber: Boolean,
    var lightsOn: Boolean,
    var internalLightsOn: Boolean,
    var brakes: Boolean,
    var inSunlight: Boolean,
    var throttle: Int,
    var steering: Int,
    var currentPosX: Int,
    var currentPosY: Int,
    var currentPosAlt: Int,
    var heading: Int,
    var pitch: Int,
    var roll: Int,
    var distanceTraveled: Int,
    var speed: Int,
    var surfaceIncline: Int,
    var oxygenTank: Float,
    var oxygenPressure: Float,
    var oxygenLevels: Float,
    var fanPri: Boolean,
    var acFanPri: Int,
    var acFanSec: Int,
    var cabinPressure: Int,
    var cabinTemperature: Float,
    var batteryLevel: Float,
    var powerConsumptionRate: Float,
    var solarPanelEfficiency: Int,
    var externalTemp: Int,
    var prCoolantLevel: Float,
    var prCoolantPressure: Float,
    var prCoolantTank: Float,
    var radiator: Int,
    var motorPowerConsumption: Int,
    var terrainCondition: Int,
    var solarPanelDustAccum: Float,
    var missionElapsedTime: Int,
    var missionPlannedTime: Int,
    var pointOfNoReturn: Int,
    var distanceFromBase: Int,
    var switchDest: Boolean,
    var destX: Int,
    var destY: Int,
    var destZ: Int,
    var dustWiper: Boolean
) {
    companion object {
        fun fromStringList(values: List<String>): PrTelemetry {
            require(values.size == 46) { "Expected 46 values, got ${values.size}" }

            var i = 0
            fun safeBoolean(value: String): Boolean {
                return when (value.lowercase()) {
                    "true", "1" -> true
                    "false", "0" -> false
                    else -> {
                        value.toDoubleOrNull()?.let { it != 0.0 } ?: false
                    }
                }
            }
            fun nextBool() = safeBoolean(values[i++])
            fun nextInt() = values[i++].toFloat().toInt()
            fun nextFloat() = values[i++].toFloat()

            return PrTelemetry(
                acHeating = nextBool(),
                acCooling = nextBool(),
                co2Scrubber = nextBool(),
                lightsOn = nextBool(),
                internalLightsOn = nextBool(),
                brakes = nextBool(),
                inSunlight = nextBool(),
                throttle = nextInt(),
                steering = nextInt(),
                currentPosX = nextInt(),
                currentPosY = nextInt(),
                currentPosAlt = nextInt(),
                heading = nextInt(),
                pitch = nextInt(),
                roll = nextInt(),
                distanceTraveled = nextInt(),
                speed = nextInt(),
                surfaceIncline = nextInt(),
                oxygenTank = nextFloat(),
                oxygenPressure = nextFloat(),
                oxygenLevels = nextFloat(),
                fanPri = nextBool(),
                acFanPri = nextInt(),
                acFanSec = nextInt(),
                cabinPressure = nextInt(),
                cabinTemperature = nextFloat(),
                batteryLevel = nextFloat(),
                powerConsumptionRate = nextFloat(),
                solarPanelEfficiency = nextInt(),
                externalTemp = nextInt(),
                prCoolantLevel = nextFloat(),
                prCoolantPressure = nextFloat(),
                prCoolantTank = nextFloat(),
                radiator = nextInt(),
                motorPowerConsumption = nextInt(),
                terrainCondition = nextInt(),
                solarPanelDustAccum = nextFloat(),
                missionElapsedTime = nextInt(),
                missionPlannedTime = nextInt(),
                pointOfNoReturn = nextInt(),
                distanceFromBase = nextInt(),
                switchDest = nextBool(),
                destX = nextInt(),
                destY = nextInt(),
                destZ = nextInt(),
                dustWiper = nextBool()
            )
        }
    }
}
