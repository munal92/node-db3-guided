const express = require('express');

const db = require('../data/db-config.js');

const Users = require('./users-model')

const router = express.Router();

router.get('/', (req, res) => {
  Users.find()
  .then(users => {
    res.json(users);
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to get users' });
  });
});





router.get('/:id', (req, res) => {
  const { id } = req.params;

  // db('users').where({ id })
  Users.findById(id)
  .then(user=> {
    //const user = users[0];

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

////
// router.get('/:id/posts', (req, res) => {
//   const {id} = req.params;
// db('posts')
// .where({user_id:id})
// .then(posts => {
//   res.json(posts)
// }).catch(err => {
//   res.status(500).json({err: 'error'})
// })

// });
router.get('/:id/posts', (req, res) => {
  const {id} = req.params;
// db('posts as p')
// .join('users as u', 'u.id' , 'p.user_id')
// .select('p.id','u.username','p.contents')
// .where({user_id:id})
Users.findPosts(id)
.then(posts => {
  res.json(posts)
}).catch(err => {
  res.status(500).json({err: 'error'})
})

});
////

router.post('/', (req, res) => {
  const userData = req.body;

  // db('users').insert(userData)
  Users.add(userData)
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

  db('users').where({ id }).update(changes)
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

  db('users').where({ id }).del()
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

module.exports = router;