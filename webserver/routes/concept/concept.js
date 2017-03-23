let express = require('express');
let router = express.Router();
let fetchConcepts = require('./functions/fetchConcepts');
let createConcept = require('./functions/createConcept');
let getConceptsAndRelations = require('./functions/getConceptsAndRelations');
let renameConcepts = require('./functions/renameConcept');

router.get('/', function(req, res) {
    let resultCallback = function(concepts) {
        res.json({
            concepts
        });
    };
    fetchConcepts(resultCallback);
});

// @vibakar: adding new concept to existing concept
router.post('/createConcept', function(req, res) {
   let newConcept = req.body.newConcept;
   let relationship = req.body.relationship;
   let oldConcept = req.body.oldConcept;
   let resultCallback = function(result) {
       res.json(result);
   };
   createConcept(newConcept, relationship, oldConcept, resultCallback);
});

// @vibakar: getting relationships and concepts from neo4j
// getting the relation and concepts
router.get('/rc', function(req, res) {
    let resultCallback = function(rc) {
        res.json({
            rc
        });
    };
    getConceptsAndRelations(resultCallback);
});

// renaming the concept
router.put('/renameConcept', function(req, res) {
    let renameConcept = req.body.renameConcept;
    let oldConcept = req.body.oldConcept;
    let resultCallback = function(result) {
        res.json(result);
    };
    renameConcepts(renameConcept, oldConcept, resultCallback);
});

module.exports = router;
