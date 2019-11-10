const models = require('../models');

const Meal = models.Meal;

const makerPage = (req, res) => {
  Meal.MealModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), Meals: docs });
  });
};

const makeMeal = (req, res) => {
  if (!req.body.name || !req.body.calories || !req.body.protien || !req.body.carbs || !req.body.fat || !req.body.sodium || ! req.body.cholesterol) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const MealData = {
    name: req.body.name,
    calories: req.body.calories,
    protien: req.body.protien,
    carbs: req.body.carbs,
    fat: req.body.fat,
    sodium: req.body.sodium,
    cholesterol: req.body.cholesterol,
    owner: req.session.account._id,
  };

  const newMeal = new Meal.MealModel(MealData);

  const MealPromise = newMeal.save();

  MealPromise.then(() => res.json({ redirect: '/maker' }));

  MealPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Meal already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return MealPromise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeMeal;
