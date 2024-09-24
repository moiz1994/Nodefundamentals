import mongoose from "mongoose";

const guitarSchema = new mongoose.Schema({
  make: String,
  model: String,
  make_lower: String,
});

const Guitar = mongoose.model("Guitar", guitarSchema);

export async function addGuitar(make, model) {
  await Guitar.create({
    make,
    model,
    make_lower: make.toLowerCase(),
  });
}

export async function getAll() {
  return await Guitar.find();
}

export async function getById(id) {
  return await Guitar.findById(id);
}

export async function getByMake(make) {
  return await Guitar.find({ make_lower: make.toLowerCase() });
}

export async function removeGuitar(id) {
  await Guitar.deleteOne({ _id: id });
}

export async function saveGuitar(id, make, model) {
  const guitar = await getById(id);

  if (guitar) {
    guitar.make = make;
    guitar.model = model;
    guitar.make_lower = make.toLowerCase();

    guitar.save();
  }
}
