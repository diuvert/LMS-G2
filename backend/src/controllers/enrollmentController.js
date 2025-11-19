const Enrollment = require('../models/Enrollment');

exports.listMine = async (req, res) => {
  const filter = req.user.role === 'student' ? { student: req.user._id } : {};
  const enrollments = await Enrollment.find(filter)
    .populate('course')
    .populate('student', 'name email');
  res.json(enrollments);
};

exports.enroll = async (req, res) => {
  const { courseId } = req.body;
  const enrollment = await Enrollment.create({ student: req.user._id, course: courseId });
  res.status(201).json(enrollment);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const enr = await Enrollment.findById(req.params.id);
  if (!enr) return res.status(404).json({ message: 'Enrollment not found' });
  if (req.user.role === 'student' && String(enr.student) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (status) enr.status = status;
  await enr.save();
  res.json(enr);
};

exports.remove = async (req, res) => {
  const enr = await Enrollment.findById(req.params.id);
  if (!enr) return res.status(404).json({ message: 'Enrollment not found' });
  if (req.user.role !== 'admin' && String(enr.student) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await enr.deleteOne();
  res.json({ message: 'Enrollment removed' });
};
