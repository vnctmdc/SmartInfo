class MarkerObject {

    constructor(id: number, lat: number, long: number, name: string) {
        this.Id = id;
        this.Latitude = lat;
        this.Longitude = long;
        this.Name = name;
    }

    public Id!: number; 

    public Latitude!: number;
    
    public Longitude!: number;

    public Name!: string;
}
export default MarkerObject;