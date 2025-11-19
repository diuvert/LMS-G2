const { validationResult } = require('express-validator');
const Course = require('../models/Course');

exports.list = async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name email role');
  res.json(courses);
};

exports.get = async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email role');
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, description } = req.body;
  const course = await Course.create({ title, description, instructor: req.user._id });
  res.status(201).json(course);
};

exports.update = async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  course.title = title ?? course.title;
  course.description = description ?? course.description;
  await course.save();
  res.json(course);
};

exports.remove = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await course.deleteOne();
  res.json({ message: 'Course deleted' });
};
