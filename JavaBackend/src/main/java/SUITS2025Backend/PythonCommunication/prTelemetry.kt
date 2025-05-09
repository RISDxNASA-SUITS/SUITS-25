data class PrTelemetry(
    var acHeating: Boolean,
    var acCooling: Boolean,
    var co2Scrubber: Boolean,
    var lightsOn: Boolean,
    var internalLightsOn: Boolean,
    var brakes: Boolean,
    var inSunlight: Boolean,
    var throttle: Float,
    var steering: Float,
    var currentPosX: Float,
    var currentPosY: Float,
    var currentPosAlt: Float,
    var heading: Float,
    var pitch: Float,
    var roll: Float,
    var distanceTraveled: Float,
    var speed: Float,
    var surfaceIncline: Float,
    var oxygenTank: Float,
    var oxygenPressure: Float,
    var oxygenLevels: Float,
    var fanPri: Boolean,
    var acFanPri: Float,
    var acFanSec: Float,
    var cabinPressure: Float,
    var cabinTemperature: Float,
    var batteryLevel: Float,
    var powerConsumptionRate: Float,
    var solarPanelEfficiency: Float,
    var externalTemp: Float,
    var prCoolantLevel: Float,
    var prCoolantPressure: Float,
    var prCoolantTank: Float,
    var radiator: Float,
    var motorPowerConsumption: Float,
    var terrainCondition: Float,
    var solarPanelDustAccum: Float,
    var missionElapsedTime: Float,
    var missionPlannedTime: Float,
    var pointOfNoReturn: Float,
    var distanceFromBase: Float,
    var switchDest: Boolean,
    var destX: Float,
    var destY: Float,
    var destZ: Float,
    var dustWiper: Boolean
) {
    companion object {
        fun fromStringList(values: List<String>): PrTelemetry {
            println(values)
            require(values.size == 48) { "Expected 48 values, got ${values.size}" }

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
                throttle = nextFloat(),
                steering = nextFloat(),
                currentPosX = nextFloat(),
                currentPosY = nextFloat(),
                currentPosAlt = nextFloat(),
                heading = nextFloat(),
                pitch = nextFloat(),
                roll = nextFloat(),
                distanceTraveled = nextFloat(),
                speed = nextFloat(),
                surfaceIncline = nextFloat(),
                oxygenTank = nextFloat(),
                oxygenPressure = nextFloat(),
                oxygenLevels = nextFloat(),
                fanPri = nextBool(),
                acFanPri = nextFloat(),
                acFanSec = nextFloat(),
                cabinPressure = nextFloat(),
                cabinTemperature = nextFloat(),
                batteryLevel = nextFloat(),
                powerConsumptionRate = nextFloat(),
                solarPanelEfficiency = nextFloat(),
                externalTemp = nextFloat(),
                prCoolantLevel = nextFloat(),
                prCoolantPressure = nextFloat(),
                prCoolantTank = nextFloat(),
                radiator = nextFloat(),
                motorPowerConsumption = nextFloat(),
                terrainCondition = nextFloat(),
                solarPanelDustAccum = nextFloat(),
                missionElapsedTime = nextFloat(),
                missionPlannedTime = nextFloat(),
                pointOfNoReturn = nextFloat(),
                distanceFromBase = nextFloat(),
                switchDest = nextBool(),
                destX = nextFloat(),
                destY = nextFloat(),
                destZ = nextFloat(),
                dustWiper = nextBool()
            )
        }
    }
}
