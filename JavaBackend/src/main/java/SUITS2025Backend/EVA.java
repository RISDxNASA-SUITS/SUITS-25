package SUITS2025Backend;

public class EVA {
    // DCU switch states
    enum Battery { LOCAL, UMB }
    enum Oxygen { SEC, PRI }
    enum Comms { B, A }
    enum Fan { SEC, PRI }
    enum Pump { CLOSE, OPEN }
    enum CO2 { B, A }

    private Battery battery;
    private Oxygen oxygen;
    private Comms comms;
    private Fan fan;
    private Pump pump;
    private CO2 co2;

    private int SiO2;
    private int Al2O3;
    private int MnO;
    private int CaO;
    private int P2O3;
    private int TiO2;
    private int FeO;
    private int MgO;
    private int K2O;
    private int other;

    TSSCommunication tss = new TSSCommunication();

    public EVA(int[] dcuState, int[] specState) {
        assert (dcuState.length == 6) : "DCU state must contain status for 6 sensors";
        this.battery = Battery.values()[dcuState[0]];
        this.oxygen = Oxygen.values()[dcuState[1]];
        this.comms = Comms.values()[dcuState[2]];
        this.fan = Fan.values()[dcuState[3]];
        this.pump = Pump.values()[dcuState[4]];
        this.co2 = CO2.values()[dcuState[5]];

        assert (specState.length == 10) : "Spec state must contain values for 10 elements";
        this.SiO2 = specState[0];
        this.Al2O3 = specState[1];
        this.MnO = specState[2];
        this.CaO = specState[3];
        this.P2O3 = specState[4];
        this.TiO2 = specState[5];
        this.FeO = specState[6];
        this.MgO = specState[7];
        this.K2O = specState[8];
        this.other = specState[9];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int[] getDCUState() {
        return new int[]{
            this.battery.ordinal(),
            this.oxygen.ordinal(),
            this.comms.ordinal(),
            this.fan.ordinal(),
            this.pump.ordinal(),
            this.co2.ordinal()
        };
    }

    public void setDCUState(int[] dcuState) {
        assert (dcuState.length == 6) : "DCU state must contain status for 6 sensors";
        this.battery = Battery.values()[dcuState[0]];
        this.oxygen = Oxygen.values()[dcuState[1]];
        this.comms = Comms.values()[dcuState[2]];
        this.fan = Fan.values()[dcuState[3]];
        this.pump = Pump.values()[dcuState[4]];
        this.co2 = CO2.values()[dcuState[5]];
    }

    public void updateDCUState() {
        int[] dcuState = tss.getEVA1DCUSwitchStates();
        assert (dcuState.length == 6) : "DCU state must contain status for 6 sensors";
        this.battery = Battery.values()[dcuState[0]];
        this.oxygen = Oxygen.values()[dcuState[1]];
        this.comms = Comms.values()[dcuState[2]];
        this.fan = Fan.values()[dcuState[3]];
        this.pump = Pump.values()[dcuState[4]];
        this.co2 = CO2.values()[dcuState[5]];
    }

    public int[] getSpecState() {
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
        return new int[]{
            this.SiO2, this.Al2O3, this.MnO, this.CaO, this.P2O3,
            this.TiO2, this.FeO, this.MgO, this.K2O, this.other
        };
    }

    public void setSpecState(int[] specState) {
        assert (specState.length == 10) : "Spec state must contain values for 10 elements";
        this.SiO2 = specState[0];
        this.Al2O3 = specState[1];
        this.MnO = specState[2];
        this.CaO = specState[3];
        this.P2O3 = specState[4];
        this.TiO2 = specState[5];
        this.FeO = specState[6];
        this.MgO = specState[7];
        this.K2O = specState[8];
        this.other = specState[9];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateSpecState() {
        int[] specState = tss.getEVA2DCUSwitchStates();
        assert (specState.length == 10) : "Spec state must contain values for 10 elements";
        this.SiO2 = specState[0];
        this.Al2O3 = specState[1];
        this.MnO = specState[2];
        this.CaO = specState[3];
        this.P2O3 = specState[4];
        this.TiO2 = specState[5];
        this.FeO = specState[6];
        this.MgO = specState[7];
        this.K2O = specState[8];
        this.other = specState[9];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }
    
    public int getBattery() {
        return this.battery.ordinal();
    }

    public void setBattery(int battery) {
        this.battery = Battery.values()[battery];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateBattery() {
        this.battery = Battery.values()[tss.sendCommands(0, 0)[0]];
    }

    public int getOxygen() {
        return this.oxygen.ordinal();
    }

    public void setOxygen(int oxygen) {
        this.oxygen = Oxygen.values()[oxygen];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateOxygen() {
        this.oxygen = Oxygen.values()[tss.sendCommands(1, 1)[0]];
    }

    public int getComms() {
        return this.comms.ordinal();
    }

    public void setComms(int comms) {
        this.comms = Comms.values()[comms];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateComms() {
        this.comms = Comms.values()[tss.sendCommands(2, 2)[0]];
    }

    public int getFan() {
        return this.fan.ordinal();
    }

    public void setFan(int fan) {
        this.fan = Fan.values()[fan];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateFan() {
        this.fan = Fan.values()[tss.sendCommands(3, 3)[0]];
    }

    public int getPump() {
        return this.pump.ordinal();
    }

    public void setPump(int pump) {
        this.pump = Pump.values()[pump];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updatePump() {
        this.pump = Pump.values()[tss.sendCommands(4, 4)[0]];
    }

    public int getCO2() {
        return this.co2.ordinal();
    }

    public void setCO2(int co2) {
        this.co2 = CO2.values()[co2];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateCO2() {
        this.co2 = CO2.values()[tss.sendCommands(5, 5)[0]];
    }

    public int getSiO2() {
        return this.SiO2;
    }

    public void setSiO2(int SiO2) {
        this.SiO2 = SiO2;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateSiO2() {
        this.SiO2 = tss.sendCommands(26, 26)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getAl2O3() {
        return this.Al2O3;
    }

    public void setAl2O3(int Al2O3) {
        this.Al2O3 = Al2O3;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateAl2O3() {
        this.Al2O3 = tss.sendCommands(27, 27)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getMnO() {
        return this.MnO;
    }

    public void setMnO(int MnO) {
        this.MnO = MnO;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateMnO() {
        this.MnO = tss.sendCommands(28, 28)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getCaO() {
        return this.CaO;
    }

    public void setCaO(int CaO) {
        this.CaO = CaO;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateCaO() {
        this.CaO = tss.sendCommands(29, 29)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getP2O3() {
        return this.P2O3;
    }

    public void setP2O3(int P2O3) {
        this.P2O3 = P2O3;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateP2O3() {
        this.P2O3 = tss.sendCommands(30, 30)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getTiO2() {
        return this.TiO2;
    }

    public void setTiO2(int TiO2) {
        this.TiO2 = TiO2;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateTiO2() {
        this.TiO2 = tss.sendCommands(31, 31)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getFeO() {
        return this.FeO;
    }

    public void setFeO(int FeO) {
        this.FeO = FeO;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateFeO() {
        this.FeO = tss.sendCommands(32, 32)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getMgO() {
        return this.MgO;
    }

    public void setMgO(int MgO) {
        this.MgO = MgO;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateMgO() {
        this.MgO = tss.sendCommands(33, 33)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getK2O() {
        return this.K2O;
    }

    public void setK2O(int K2O) {
        this.K2O = K2O;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateK2O() {
        this.K2O = tss.sendCommands(34, 34)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public int getOther() {
        return this.other;
    }

    public void setOther(int other) {
        this.other = other;
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }

    public void updateOther() {
        this.other = tss.sendCommands(35, 35)[0];
        assert (this.SiO2 + this.Al2O3 + this.MnO + this.CaO + this.P2O3 +
                this.TiO2 + this.FeO + this.MgO + this.K2O + this.other == 100) : "Sum of components must be 100%";
    }
}
