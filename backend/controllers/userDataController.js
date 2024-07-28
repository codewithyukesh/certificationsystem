const UserData = require('../models/UserData');

exports.submitUserData = async (req, res) => {
  const { templateId, data } = req.body;
  const userData = new UserData({
    templateId,
    data,
    createdBy: req.user._id,
  });

  try {
    await userData.save();
    res.status(201).json({ message: 'User data submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUserData = async (req, res) => {
  try {
    const userData = await UserData.find();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserDataById = async (req, res) => {
  const { id } = req.params;

  try {
    const userData = await UserData.findById(id);
    if (!userData) return res.status(404).json({ message: 'User data not found' });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
