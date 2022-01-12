const router = require('express').Router();
const { c } = require('tar');
const { User } = require('../../models');

// URL: /api/user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create({
      // TODO: SET USERNAME TO USERNAME SENT IN REQUEST
        username: req.body.username, // params vs body?
      // TODO: SET PASSWORD TO PASSWORD SENT IN REQUEST
      password: req.body.password,
    });

    req.session.save(() => {
      // TODO: SET USERID userId IN REQUEST SESSION TO ID RETURNED FROM DATABASE
      req.session.userId = newUser.id;//userData.id?
      // TODO: SET USERNAME username IN REQUEST SESSION TO USERNAME RETURNED FROM DATABASE
      req.session.username = newUser.username;
      // TODO: SET LOGGEDIN loggedIn TO TRUE IN REQUEST SESSION
      req.session.loggedIn = true;
      res.json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// URL: /api/user/login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    req.session.save(() => {
      // TODO: SET USERID userId IN REQUEST SESSION TO ID RETURNED FROM DATABASE
      req.session.userId = user.id; //user.Id? or user.id? does capital matter. yes it does
      // TODO: SET USERNAME username IN REQUEST SESSION TO USERNAME RETURNED FROM DATABASE
      req.session.username = user.username;
      // TODO: SET LOGGEDIN loggedIn TO TRUE IN REQUEST SESSION
      req.session.loggedIn = true;
      res.json({ user, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json({ message: 'No user account found!' });
  }
});

router.post('/logout', (req, res) => {
  console.log("Logged out");
  console.log(req.session.loggedIn);
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;