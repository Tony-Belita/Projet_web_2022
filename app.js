var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
////////////////////////////// Ajout de code //////////////////////////////
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/////////////////////////////////////// Ajout de code  ///////////////////////////////////////

//import de la class Evenement
const Evenement = require('./evenement');
const Utilisateur = require('./utilisateur');

// liste des evenements de l'appli
const mesEvt = [];

//liste des utilisateur
let mesUtilisateurs = [];

// vérifie si un attribut est présent
function estPresent(attribut) {
  return attribut !== undefined;
}

///////////////////////////////////////////////////// Route /////////////////////////////////////////////////////
/////////////////////////////// Evenement ///////////////////////////////
/////// Creer evenement ///////
app.post('/Evenement/Add', function(req,res){
  let trouve = false;
  let i=0;
  let evt;
  // on vérifie que le body a bien tous les attributs : nom et
  if(estPresent(req.body.nom) && estPresent(req.body.listeHeure) && estPresent(req.body.date)&& estPresent(req.body.pseudo)) {
      // on appelle la méthode creeCompte de banque
      try{

        while (trouve==false && i < mesUtilisateurs.length){
          if(mesUtilisateurs[i].pseudo == req.body.pseudo){
            evt = new Evenement(req.body.nom,req.body.date,req.body.listeHeure,req.body.pseudo,mesEvt.length);
            mesEvt.push(evt);
            mesUtilisateurs[i].listeCreation(evt);
            trouve = true;
          }
          i=i+1;
        }
        if(trouve == false){
          res.status(400).send(`L'utilisateur n'existe pas`);
        }
        res.send("Creation ok");
      } catch (e){
        res.status(400).send(`Erreur lors de la creation de l'evenement : ${e}`);
      }
  } else {
    // on renvoie une erreur 400
    res.status(400).send('Il manque des informations');
  }
});

/////// Voir tout les evenements ///////
app.get('/Evenement', function(req,res){
  res.json(mesEvt);
});

/////// Voir un evenement ///////
app.get('/Evenement/:id', function(req,res){

  if (estPresent(req.params.id)){
      res.json(mesEvt[req.params.id]);

  }else{
    // on envoie une erreur 404
    res.status(404).send('Il manque des informations');
  }
});

/////// inscire quelq'un a un evenement ///////
app.put('/Evenement/:id', function(req,res){
  let trouve = false;
  let i=0;
  if( estPresent(req.params.id) && estPresent(req.body.pseudo) && estPresent(req.body.choix) && estPresent(req.body.heure) ){

      if(req.body.choix == true){
        try{
          while (trouve==false && i < mesUtilisateurs.length){
            if(mesUtilisateurs[i].pseudo == req.body.pseudo){
              mesEvt[req.params.id].ajouterParticipant(req.body.pseudo,req.body.heure);
              mesUtilisateurs[i].majlistInscription(mesEvt[req.params.id].nom,mesEvt[req.params.id].date,req.body.heure,req.body.choix);
              trouve = true;
            }
            i=i+1;
          }
          if(trouve == false){
            res.status(400).send(`L'utilisateur n'existe pas`);
          }
          res.send("Modification ok");
        } catch (e){
          res.status(400).send(`Erreur lors de la ajout à l'evenement : ${e}`);
        }
      }else {
        try {
          while (trouve==false && i < mesUtilisateurs.length){
            if(mesUtilisateurs[i].pseudo == req.body.pseudo){
              mesEvt[req.params.id].ajouterParticipantNeg(req.body.pseudo,req.body.heure);
              mesUtilisateurs[i].majlistInscription(mesEvt[req.params.id].nom,mesEvt[req.params.id].date,req.body.heure,req.body.choix);
              trouve = true;
            }
            i=i+1;
          }
          if(trouve == false){
            res.status(400).send(`L'utilisateur n'existe pas`);
          }
          res.send("Modification ok");
        } catch (e){
          res.status(400).send(`Erreur lors de la ajout à l'evenement : ${e}`);
        }
      }
  }else{
    // on envoie une erreur 404
    res.status(400).send('Il manque des informations');
  }
});


/////////////////////////////// Se connecter ///////////////////////////////
/////// Tous les comptes ///////
app.get('/Evenement/Compte', function(req,res){
  res.json(mesUtilisateurs);
});
/////// Se connecter avec un mail ///////
app.post('/Evenement/SeConnecter', function(req,res){
  let trouve = false;
  let i=0;
  if( estPresent(req.body.pseudo) ){
    while (trouve==false && i < mesUtilisateurs.length){
      if(mesUtilisateurs[i].pseudo == req.body.pseudo){
        res.json(req.body.pseudo);
        trouve = true;
      }
      i=i+1;
    }
    res.status(400).send('L\'utilisateur n\'existe pas');
  }else{
    // on envoie une erreur 404
    res.status(400).send('Il manque des informations');
  }

});
/////// Creation d'un compte utilisateur ///////
app.post('/Evenement/CreerCompte', function(req,res){
  let trouve = false;
  let i=0;
  let j=0;
  // on vérifie que le body a bien tous les attributs : nom et
  if(estPresent(req.body.nom) && estPresent(req.body.pseudo)) {
    // on appelle la méthode creeCompte de banque
    try{
      while (trouve==false && i < mesUtilisateurs.length){
        if(mesUtilisateurs[i].pseudo == req.body.pseudo){
          trouve = true;
          j=i;
        }
        i=i+1;
      }
      if(trouve == true){
        res.status(400).send(`Ce pseudo est deja pris`);
      }
      mesUtilisateurs.push(new Utilisateur(req.body.nom,req.body.pseudo,mesUtilisateurs.length))
      console.log(mesUtilisateurs);
      res.send("Creation ok");
    } catch (e){
      res.status(400).send(`Erreur lors de la creation de l'utilisateur : ${e}`);
    }
  } else {
    // on renvoie une erreur 400
    res.status(400).send('Il manque des informations');
  }

});
/////// Voir un compte utilisateur ///////
app.get('/Evenement/Compte/:id', function(req,res){

  if (estPresent(req.params.id)){
    res.json(mesUtilisateurs[req.params.id]);
  }else{
    // on envoie une erreur 404
    res.status(404).send('Il manque des informations');
  }
});




///////////////////////////////////////////////////// Derniere ligne /////////////////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
