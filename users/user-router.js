const express = require('express');

// the knex reference that used to be here (through db-config) is replaced by a
// reference to our data model object: user-model.
const users = require('./user-model.js');
// const db = require('../data/db-config.js');


const router = express.Router();

//----------------------------------------------------------------------------//
// Each of these middleware route handlers have been refactored to use our
// helper db functions from user-model.js.
// 
// This helps us keep our source files single-purpose, simplifying testing and
// troubleshooting, etc.
//----------------------------------------------------------------------------//
router.get('/', (req, res) => {
  users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get users' });
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  users.findById(id)
    .then(users => {
      const user = users[0];

      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'Could not find user with given id.' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get user' });
    });
});

router.post('/', (req, res) => {
  const userData = req.body;

  users.add(userData)
    .then(ids => {
      res.status(201).json({ created: ids[0] });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to create new user' });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  users.update(changes, id)
    .then(count => {
      if (count) {
        res.json({ update: count });
      } else {
        res.status(404).json({ message: 'Could not find user with given id' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to update user' });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  users.remove(id)
    .then(count => {
      if (count) {
        res.json({ removed: count });
      } else {
        res.status(404).json({ message: 'Could not find user with given id' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to delete user' });
    });
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params;

  users.findPosts(id)
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: 'problem with the db', error: err });
    });
});

module.exports = router;