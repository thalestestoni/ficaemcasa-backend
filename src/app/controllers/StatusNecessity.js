import Necessity from '../models/Necessity';

class StatusNecessity {
  async update(req, res) {
    const { id } = req.params;

    const necessity = await Necessity.findById(id);

    if (!necessity) {
      return res.status(400).json({ error: 'Necessity not found' });
    }

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status não informado' });
    }

    await Necessity.findByIdAndUpdate(id, {
      status,
    });

    return res.send();
  }
}

export default new StatusNecessity();
