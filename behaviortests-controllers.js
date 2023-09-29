const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const helper = require('../util/helper');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Behaviortest = require('../models/behaviortest');
const Behavior = require('../models/behavior');


const getBehaviortestById = async (req, res, next) => {
  const behaviortestId = req.params.id;

  let behaviortest;
  try {
    behaviortest = await Behaviortest.findById(behaviortestId);
  } catch (err) {
    const error = new HttpError(
      'Davranış Testi aranırken hata.' + err,
      500
    );
    return next(error);
  }

  if (!behaviortest) {
    const error = new HttpError(
      'Davranış Testi bulunamadı.',
      404
    );
    return next(error);
  }

  res.json({ behaviortest: behaviortest.toObject({ getters: true }) });
};

const getBehaviortests = async (req, res, next) => {
  let behaviortests;
  try {
    behaviortests = await Behaviortest.find();
  } catch (err) {
    const error = new HttpError(
      'Davranış Testi çekilemedi.' + err,
      500
    );
    return next(error);
  }
  res.json({ behaviortests: behaviortests.map(behaviortest => behaviortest.toObject({ getters: true })) });
};

const deleteBehaviortest = async (req, res, next) => {
  const behaviortestId = req.params.id;

  let behaviortest;
  try {
    behaviortest = await Behaviortest.findById(behaviortestId)
  } catch (err) {
    const error = new HttpError(
      'Davranış Testi silimedi.',
      500
    );
    return next(error);
  }

  if (!behaviortest) {
    const error = new HttpError('Davranış Testi bulunamadı.', 404);
    return next(error);
  }


  try {
    await Behavior.deleteMany({behaviortest: behaviortestId});
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Davranış Testi silinemedi.',
      500
    );
    return next(error);
  }

  try {
  
    await behaviortest.remove();
  } catch (err) {
    console.log;(err);
    const error = new HttpError(
      'Davranış Testi silinemedi.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted behaviortest.' });
};

const updateBehaviortest = async (req, res, next) => {
  const behaviortestId = req.params.id;
  const {date, tip, katilimcino, sinif, testsirasi, sorumlu, yas, cinsiyet, aciklama} = req.body;

  let behaviortest;
  try {
    behaviortest = await Behaviortest.findById(behaviortestId)
  } catch (err) {
    const error = new HttpError(
      'Davranış Testi bulunamadı.',
      500
    );
    return next(error);
  }

  if (!behaviortest) {
    const error = new HttpError(
      'Davranış Testi bulunamadı.',
      422
    );
    return next(error);
  }

  behaviortest.date = date;
  behaviortest.sorumlu = sorumlu;
  behaviortest.katilimcino = katilimcino;
  behaviortest.tip = tip;
  behaviortest.testsirasi = testsirasi;
  behaviortest.yas = yas;
  behaviortest.sinif = sinif;
  behaviortest.cinsiyet = cinsiyet;
  behaviortest.aciklama = aciklama;

  try {
    await behaviortest.save();
  } catch (err) {
    const error = new HttpError(
      'Davranış Testi güncellenemedi.',
      500
    );
    return next(error);
  }

  res.status(200).json({ behaviortest: behaviortest.toObject({ getters: true }) });
};

const createBehaviortest = async (req, res, next) => {
  
  const {sorumlu, tip, katilimcino, sinif, yas, testsirasi, cinsiyet, aciklama} = req.body;
    const createdBehaviortest = new Behaviortest({
      date: helper.getMoment(),
      tip,
      sorumlu,
      katilimcino,
      yas,
      testsirasi,
      sinif,
      cinsiyet,
      aciklama
    });
  try
  {
      await createdBehaviortest.save();
  }
  catch{}

    res.status(201).json({ behaviortest: createdBehaviortest.toObject({ getters: true }) });
  };


  exports.createBehaviortest = createBehaviortest;
  exports.getBehaviortests = getBehaviortests;
  exports.getBehaviortestById = getBehaviortestById;
  exports.updateBehaviortest = updateBehaviortest;
  exports.deleteBehaviortest = deleteBehaviortest;