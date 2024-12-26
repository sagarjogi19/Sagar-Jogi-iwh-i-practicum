require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const BASE_URL = 'https://api.hubapi.com/crm/v3/objects';
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY; 

// Homepage route
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/2-11678211?properties=classes,region,word_mark_specification_text`, {
      headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}` },
    });
    console.log(response);
    const records = response.data.results;
    res.render('homepage', {
      title: 'Custom Object Table',
      records,
    });
  } catch (error) {
    console.error('Error fetching records:', error.response?.data || error.message);
    res.status(500).send(error.message);
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form' });
});


app.post('/update-cobj', async (req, res) => {
  try {
    const { word_mark_specification_text, region, classes } = req.body;
    const data = {
      properties: {
        word_mark_specification_text,
        region,
        classes,
      },
    };

    await axios.post(`${BASE_URL}/2-11678211`, data, {
      headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}` },
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error creating/updating record:', error.response?.data || error.message);
    res.status(500).send('Failed to create/update record.');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
