"use strict";

const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();
const { NotFoundError } = require("./expressError");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/** get all items */
router.get('/', function(req, res) {
  return res.json({items: db.items});
});

/** add an item */
router.post('/', function(req, res) {
  let newItem = {name: req.body.name, price: req.body.price};
  db.items.push(newItem);
  return res.status(201).json({added: newItem});
})

/** get a specific item */
router.get("/:name", function(req, res){
  const searchItem = req.params.name;
  const itemDetails = db.items.filter(item => item.name === searchItem);
  //use find instead of filter, which returns undefined
  if(itemDetails.length === 0){
    throw new NotFoundError;
  }
  return res.json(itemDetails[0]);
})

/** update an item */
router.patch("/:name", function(req, res){
  const updateItem = req.params.name;
  const itemDetails = db.items.filter(item => item.name === updateItem);
  if(itemDetails.length === 0){
    throw new NotFoundError;
  }
  itemDetails[0].name = req.body.name || itemDetails[0].name;
  itemDetails[0].price = req.body.price || itemDetails[0].price;
  return res.json({updated: itemDetails[0]});
})

/** delete an item */
router.delete("/:name", function(req, res){
  const deletedItem = req.params.name;
  db.items = db.items.filter(item => item.name !== deletedItem);
  return res.json({message: "Deleted"});
})

module.exports = router;