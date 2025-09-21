//const _ = require('lodash');

/*
Goals: Design a parking lot using object-oriented principles

Here are a few methods that you should be able to run:

x Tell us how many spots are remaining
x Tell us how many total spots are in the parking lot
Tell us when the parking lot is full
Tell us when the parking lot is empty
Tell us when certain spots are full e.g. when all motorcycle spots are taken
Tell us how many spots vans are taking up

Assumptions:

1. The parking lot can hold motorcycles, cars and vans
2. The parking lot has motorcycle spots, car spots and large spots
3. A motorcycle can park in any spot
4. A car can park in a single compact spot, or a regular spot
5. A van can park, but it will take up 3 regular spots
These are just a few assumptions. Feel free to ask your interviewer about more assumptions as needed

My interpretations / asumptions:

Spots (very inconsistent terminology in the spec):
- motorcycle (simple)
- "compact" (in 4) is the same as car spot (in 2)
- "large" (in 2) is the same as regular (in 4 & 5)

Van = moving van (big), not a passenger or minivan

Since there is not a definition of the layout, and a van will take 3 regular spots, for simplicity,
assume that it must take 3 consecutive (large / regular) spots.

We will assume that things are done effeciently, that is to say that everyone will use the smallest / first available option. (OK - completely unrealistic, but otherwise we have to track a grid and that is not something that I can do in an hour.)

*/

type spotSize = "motorcycle" | "compact" | "large"
type vehicleType = "empty" | "motorcycle" | "car" | "van"

interface parkingSpot {
  size: spotSize;
  occuppiedBy: vehicleType;
  vanSpace1?: number;
  vanSpace2?: number;
  vanSpace3?: number;
}

interface lotStatus {
  parkedMotorcycles: number;
  parkedCars: number;
  parkedVans: number;
  availableMotorcycleSpots: number;
  availableCarSpots: number;
  availableVanSpots: number;
}

class ParkingLot {
  private spaces: parkingSpot[] = [];

  private spaceCount = 0; // totalSpaces
  private mCount = 0; // count of motorcycles parked
  private cCount = 0; // count of cars parked
  private vCount = 0; // count of vans parked

  // calling this will reset / empty an existing parking lot...
  public setup(motorcycleSpots: number, compactSpots: number, largeSpots: number): void {
    this.spaces = []
    let spot: parkingSpot = {
      size: "motorcycle",
      occuppiedBy: "empty",
    }
    for (let i = 0; i < motorcycleSpots; i++ ) {
      this.spaces.push(spot)
      this.spaceCount++
    }

    spot = {
      size: "compact",
      occuppiedBy: "empty",
    }

    for (let i = 0; i < compactSpots; i++ ) {
      this.spaces.push(spot)
      this.spaceCount++
    }

    spot = {
      size: "large",
      occuppiedBy: "empty",
    }

    for (let i = 0; i < largeSpots; i++ ) {
      this.spaces.push(spot)
      this.spaceCount++
    }
  }

  remaining(): number {
    return this.spaceCount - this.mCount - this.cCount - (3 * this.vCount);
  }

  totalSpaces(): number {
    return this.spaceCount;
  }

  isFull(): boolean {
    if (this.remaining() == 0) {
      return true
    }
    return false
  }

  isEmpty(): boolean {
    if (this.mCount == 0 && this.cCount == 0 && this.vCount == 0) {
      return true;
    }
    return false;
  }

  spotsFilledByVans(): number {
    return this.vCount * 3;
  }

  // count is the request, function returns the number actually parked
  park(vehicle: vehicleType, count = 1): number {
    let parked = 0

    for (let i = 0; i < count; i++) {
      const nextSpace = this.getNextAvailableSpot(vehicle);
      if (nextSpace == -1) {
        return parked
      }
      this.spaces[nextSpace].occuppiedBy = vehicle

      if (vehicle == "motorcycle") {
        this.mCount++
      }
      if (vehicle == "car") {
        this.cCount++
      }
      if (vehicle == "van") {
        // trust the getNextAvailableSpot function to validate
        for (let v = 0; v < 3; v++) {
          this.spaces[nextSpace + v].occuppiedBy = vehicle
          this.spaces[nextSpace + v].vanSpace1 = nextSpace
          this.spaces[nextSpace + v].vanSpace2 = nextSpace + 1
          this.spaces[nextSpace + v].vanSpace3 = nextSpace + 2
        }
        this.vCount++
      }
    }

    return parked
  }

  // this is pretty simple
  // except for vans
  remove(space: number): boolean {


    return false
  }

  private getNextAvailableSpot(vehicle: vehicleType): number {
    let van: number[] = []

    // since vehicles can be removed from any space, we need to loop
    for (let i=0; i < this.spaces.length; i++) {
      if (this.spaces[i].occuppiedBy == "empty") {
        if (vehicle == "motorcycle") {
          // any type will work
          return i
        } else if (vehicle == "car") {
          if (this.spaces[i].size != "motorcycle") {
            return i
          }
        } else if (vehicle == "van") {
          if (this.spaces[i].size == "large") {
            if (van.length == 0) {
              van.push(i);
            } else if (van.length == 1) {
              // so we have 1 spot, is this consecutive?
              if (van[0] + 1 == i) {
                // found a 2nd
                van.push(i)
              } else {
                // reset the first
                van[0] = i
              }
            } else if (van.length == 2) {
              // so we have 2 spots, is this consecutive?
              if (van[1] + 1 == i) {
                // we already have 2, and this would be the third available
                return van[0];
              } else {
                // reset and start looking again
                van = [i]
              }
            }
          }
        }
      }
    }
    // this will let us just use numbers
    return -1
  }
}

let lot = new ParkingLot

lot.setup(10,10,10)
