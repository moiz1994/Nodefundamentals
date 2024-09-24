import {
  addGuitar,
  getAll,
  getById,
  getByMake,
  removeGuitar,
  saveGuitar,
} from "./model.js";

export async function createGuitar(req, res) {
  res.render("guitars/form");
}

export async function deleteGuitar(req, res) {
  const id = req.params.id;

  if (!isIdValid(id)) {
    res.send(404);
    return;
  }

  await removeGuitar(id);
  res.redirect("/guitars");
}

export async function editGuitar(req, res) {
  const id = req.params.id;

  if (!isIdValid(id)) {
    res.send(404);
    return;
  }

  const guitar = await getById(id);

  if (!guitar) {
    res.send(404);
    return;
  }

  res.render("guitars/form", { guitar: convertToObj(guitar) });
}

export async function listGuitars(req, res) {
  const guitars = await getAll();
  res.render("guitars/list", {
    guitars: guitars.map(convertToObj),
    title: "My Guitars",
  });
}

export async function showGuitar(req, res) {
  const id = req.params.id;

  if (isIdValid(id)) {
    const guitar = await getById(id);

    if (!guitar) {
      res.send(404);
    } else {
      res.render("guitars/show", {
        guitar: convertToObj(guitar),
        title: `Guitar: ${guitar.make} ${guitar.model}`,
      });
    }
  } else {
    const found = await getByMake(req.params.id);

    if (found.length === 0) {
      res.send(404);
    } else {
      res.render("guitars/list", {
        guitars: found.map(convertToObj),
        title: `Guitars Made By ${found[0].make}`,
      });
    }
  }
}

export async function storeGuitar(req, res) {
  const { guitar_make, guitar_model } = req.body;

  if (guitar_make && guitar_model) {
    await addGuitar(guitar_make, guitar_model);
    res.redirect("/guitars");
  } else {
    res.redirect("/guitars/create");
  }
}

export async function updateGuitar(req, res) {
  const id = req.params.id;

  if (!isIdValid(id)) {
    res.send(404);
    return;
  }

  const { guitar_make, guitar_model } = req.body;

  if (guitar_make && guitar_model) {
    await saveGuitar(id, guitar_make, guitar_model);
    res.redirect(`/guitars/${id}`);
  } else {
    res.redirect(`/guitars/${id}/edit`);
  }
}

const convertToObj = (g) => ({ id: g._id, make: g.make, model: g.model });
const isIdValid = (id) => id.length === 24;
