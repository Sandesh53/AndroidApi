const jwt = require("jsonwebtoken");
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "electricity_db"
  }
});

const addConsumer = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      const username = req.body.username;
      const password = req.body.password;
      const fullName = req.body.fullName;
      const phone = req.body.phone;
      const email = req.body.email;
      const address = req.body.address;

      knex("consumers")
        .insert({ username, password, fullName, phone, email, address })
        .then(() =>
          res.json({ status: true, message: "User created successfully." })
        )
        .catch(() =>
          res.json({ status: false, message: "Failed to create user." })
        );
    }
  });
};

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  knex("consumers")
    .select()
    .where({ username, password })
    .then(data => {
      if (data.length != 0) {
        jwt.sign({ username, password }, "secretkey", (err, token) => {
          res.json({
            status: true,
            token,
            data: data[0]
          });
        });
      } else {
        res.json({
          status: false,
          message: "Username and password does not match."
        });
      }
    })
    .catch(err => res.json({ status: false, message: err.message }));
};

const deleteConsumer = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      const id = req.params.id;
      knex("consumers")
        .where({ id })
        .del()
        .then(() =>
          res.json({ status: true, message: "Consumer deleted successfully." })
        )
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const updateConsumer = (req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address;
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex("consumers")
        .where({ id })
        .update({ username, password, fullName, phone, email, address })
        .then(() =>
          res.json({ status: true, message: "Consumer updated successfully." })
        )
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const getAllConsumers = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .select()
        .table("consumers")
        .then(data => res.json({ status: true, data }))
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const getConsumerById = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .select()
        .table("consumers")
        .where({ id: req.params.id })
        .then(data => res.json({ data }))
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.json({ status: false, message: "You are not authorized." });
  }
}

const addBill = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      const unitConsumed = req.body.unitConsumed;
      const date = req.body.date;
      const consumerId = req.body.consumerId;
      const isPaid = req.body.isPaid;
      knex
        .table("bills")
        .select()
        .where({ consumerId, date })
        .then(data => {
          if (data.length == 0) {
            knex
              .table("bills")
              .insert({ unitConsumed, date, consumerId, isPaid })
              .then(() =>
                res.json({ status: true, message: "Bill added successfully." })
              )
              .catch(err => res.json({ status: false, message: err.message }));
          } else {
            res.json({
              status: false,
              message: "Consumer has already bills for this date."
            });
          }
        })
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const payBill = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .table("bills")
        .update({ isPaid: true })
        .where({ id: req.params.id })
        .then(() => res.json({ status: true, message: "Bill has been paid" }))
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const getAllUnitConsumed = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .table("bills")
        .select(knex.raw("sum(unitConsumed) as unitConsumed"))
        .where({ consumerId: req.params.consumerId, isPaid: 0 })
        .then(data =>
          res.json({
            status: true,
            message: "All Bills",
            data: data[0].unitConsumed
          })
        )
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const getAllBills = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .table("bills")
        .select()
        .where({ consumerId: req.params.consumerId })
        .then(data =>
          res.json({
            status: true,
            message: "All Bills",
            data
          })
        )
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const getPerUnitCost = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .table("unit_costs")
        .select()
        .then(data =>
          res.json({
            status: true,
            message: "Unit Cost!!!",
            data: data[0].unitCost
          })
        )
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

const updatePerUnitCost = (req, res) => {
  jwt.verify(req.token, "secretkey", err => {
    if (err) {
      res.json({ status: false, message: "You are not authorized." });
    } else {
      knex
        .table("unit_costs")
        .update({ unitCost: req.body.cost })
        .then(() => res.json({ status: true, message: "Updated!!!" }))
        .catch(err => res.json({ status: false, message: err.message }));
    }
  });
};

module.exports = {
  addConsumer,
  login,
  updateConsumer,
  getAllConsumers,
  deleteConsumer,
  getConsumerById,
  verifyToken,
  payBill,
  addBill,
  getAllBills,
  getAllUnitConsumed,
  getPerUnitCost,
  updatePerUnitCost
};
