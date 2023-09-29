const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Behavior = require('../models/behavior');


const getBehaviorById = async (req, res, next) => {
  const behaviorId = req.params.id;

  let behavior;
  try {
    behavior = await Behavior.findById(behaviorId);
  } catch (err) {
    const error = new HttpError(
      'Darvranış aranırken hata.' + err,
      500
    );
    return next(error);
  }

  if (!behavior) {
    const error = new HttpError(
      'Darvranış bulunamadı.',
      404
    );
    return next(error);
  }

  res.json({ behavior: behavior.toObject({ getters: true }) });
};

const getBehaviors = async (req, res, next) => {
  let behaviors;
  try {
    behaviors = await Behavior.find();
  } catch (err) {
    const error = new HttpError(
      'Davranışlar sistemden çekilemedi.' + err,
      500
    );
    return next(error);
  }
  res.json({ behaviors: behaviors.map(behavior => behavior.toObject({ getters: true })) });
};

const deleteBehavior = async (req, res, next) => {
  const behaviorId = req.params.id;

  let behavior;
  try {
    behavior = await Behavior.findById(behaviorId)
  } catch (err) {
    const error = new HttpError(
      'Davranış silinemedi.',
      500
    );
    return next(error);
  }

  if (!behavior) {
    const error = new HttpError('Davranış bulunamadı.', 404);
    return next(error);
  }

  try {
  
    await behavior.remove();
  } catch (err) {
    console.log;(err);
    const error = new HttpError(
      'Davranış silinmesinde hata.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted behavior.' });
};

const updateBehavior = async (req, res, next) => {
 
  const {behaviortest, uyarici, sekil, beklenen, tepki, sure, sonuc} = req.body;
  const behaviorId = req.params.id;

  let behavior;
  try {
    behavior = await Behavior.findById(behaviorId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update behavior.',
      500
    );
    return next(error);
  }

  if (!behavior) {
    const error = new HttpError(
      'Davranış bulunamadı.',
      422
    );
    return next(error);
  }

  behavior.behaviortest = behaviortest;
  behavior.uyarici = uyarici;
  behavior.sekil = sekil;
  behavior.beklenen = beklenen;
  behavior.tepki = tepki;
  behavior.sure = sure;
  behavior.sonuc = sonuc;

  try {
    await behavior.save();
  } catch (err) {
    const error = new HttpError(
      'Davranış güncellenemedi.',
      500
    );
    return next(error);
  }

  res.status(200).json({ behavior: behavior.toObject({ getters: true }) });
};

const createBehavior = async (req, res, next) => {
    
    const {behaviortest, uyarici, sekil, beklenen, tepki, sure, sonuc} = req.body;
  
    const createdBehavior = new Behavior({
      behaviortest,
      uyarici,
      sekil,
      beklenen,
      tepki,
      sure,
      sonuc
    });
  try
  {
      await createdBehavior.save();
  }
  catch (err) {
    console.log(err);
  }

    res.status(201).json({ behavior: createdBehavior.toObject({ getters: true }) });
  };


  exports.createBehavior = createBehavior;
  exports.getBehaviors = getBehaviors;
  exports.getBehaviorById = getBehaviorById;
  exports.updateBehavior = updateBehavior;
  exports.deleteBehavior = deleteBehavior;