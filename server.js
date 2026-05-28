require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const { connectDB } = require('./src/config/db');
const seedAdmin = require('./src/config/seed');
const authRoutes = require('./src/routes/auth');
const evidenceRoutes = require('./src/routes/evidence');

const app = express();
const PORT = process.env.PORT || 2502;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.DB_NAME || 'sistema_provas',
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use('/', authRoutes);
app.use('/evidence', evidenceRoutes);

app.get('/', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.redirect('/evidence');
});

async function start() {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar:', err);
    process.exit(1);
  }
}

start();
