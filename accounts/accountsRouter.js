const express = require("express");
const router = express.Router();

const Accounts = require("./accountsDb");

router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const accounts = await Accounts.get(req.query);
    if (accounts.length) {
      res.status(200).json(accounts);
    } else {
      res.status(404).json({ message: "No accounts were found." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The accounts information could not be retrieved." });
  }
});

router.get("/count", async (req, res) => {
  try {
    const total = await Accounts.getTotal();
    res.status(200).json(total[0]["count(*)"]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The total number of accounts couldn't be retrieved." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const account = await Accounts.getById(id);
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: "No account found." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The account information could not be retrieved." });
  }
});

router.post("/", async (req, res) => {
  const { name, budget } = req.body;
  if (!name || !budget) {
    res.status(400).json({ message: "Name and budget fields are required" });
    return;
  }
  try {
    const account = await Accounts.insert({ name, budget });
    res.status(201).json(await Accounts.getById(account.id));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The account information could not be added." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Accounts.remove(id);
    res.status(200).json(deleted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "The account could not be removed" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, budget } = req.body;
  if (!name && !budget) {
    res.status(400).json({ message: "Must include name and/or budget fields" });
    return;
  }
  try {
    const account = await Accounts.update(id, { name, budget });
    if (account) {
      res.status(200).json(await Accounts.getById(id));
    } else {
      res.status(404).json({ message: "Account with that id not found." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "The account information could not be modified." });
  }
});

module.exports = router;
