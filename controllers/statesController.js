const States = require("../model/States");
const statesData = require("../model/states.json");

const getAllStates = async (req, res) => {
  let result;
  if (req?.query?.contig === undefined) {
    result = await [...statesData]; 
  } else {
    result = await findStatesByContiguity(req.query.contig);
  }
  result.forEach(async (state) => {
    const stateExists = await States.findOne({ stateCode: state.code }).exec();
    if (stateExists) 
    {
      state.funfacts = [...stateExists.funfacts];
    }
  });
  res.json(result);
};

const getFunFacts = async (req, res) => {
  const facts = await States.findOne({ stateCode: req.code }).exec();

  if (!facts) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.name}` });
  }
  const randIndex = Math.floor(Math.random() * facts.funfacts.length);
  console.log(randIndex);

  res.json({ funfact: `${facts.funfacts[randIndex]}` });
};

const getState = async (req, res) => {
  let state = await findState(req.code);
    const stateExists = await States.findOne({ stateCode: state.code }).exec();
    if (stateExists) {
      state.funfacts = [...stateExists.funfacts];
    }
    res.json(state);
};

const getCapital = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    capital: state.capital_city,
  });
};

const getNickname = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    nickname: state.nickname,
  });
};

const getPopulation = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    population: state.population.toLocaleString("en-US"),
  });
};

const getAdmission = async (req, res) => {
  let state = await findState(req.code);
  res.json({
    state: state.state,
    admitted: state.admission_date,
  });
};

const findState = async (code) => statesData.find(st => st.code === code);

const findStatesByContiguity = async (isContiguous) => {
  let result;
  if (isContiguous === "true") {
    result = statesData.filter((st) => st.code !== "AK" && st.code !== "HI");
  } else {
    result = statesData.filter((st) => st.code === "AK" || st.code === "HI");
  }
  return result;
};

const createNewFunFacts = async (req, res) => {
    if (!req?.body?.funfacts) 
    {
      return res
        .status(400)
        .json({ message: "State fun facts value required"});
    }
  
    if (!Array.isArray(req.body.funfacts)) {
      return res
        .status(400)
        .json({ message: "State fun facts value must be an array"});
    }
  
    const facts = await States.findOne({ stateCode: req.code }).exec();
    let result;
    
    if (!facts) 
    {
      result = await States.create({
        stateCode: req.code,
        funfacts: req.body.funfacts,
      });
    } else {
    facts.funfacts = [...facts.funfacts, ...req.body.funfacts];
    result = await facts.save();
    }
    res.json(result);
  };
  
  const updateFunFacts = async (req, res) => {
    if (!req?.body?.index) 
    {
      return res
        .status(400)
        .json({ message: "State fun fact index value required" });
    }
  
    if (!req?.body?.funfact) 
    {
      return res
        .status(400)
        .json({ message: "State fun fact value required"});
    }
    const index = req.body.index-1;
    const facts = await States.findOne({ stateCode: req.code }).exec();
    
    if (!facts) 
    {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${req.name}` });
    }
  
    if (index >= facts.funfacts.length) 
    {
      return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${req.name}` });
    }
  
    if (!facts.funfacts[index]) 
    {
      return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${req.name}` });
    }
    facts.funfacts[index] = req.body.funfact;
    console.log(facts); 
    const result = await facts.save();
  
    res.json(result);
  };
  
  const deleteFunFacts = async (req, res) => {
    if (!req?.body?.index) {
      return res
        .status(400)
        .json({ message: "State fun fact index value required" });
    }
    const index = req.body.index-1;
    const facts = await States.findOne({ stateCode: req.code }).exec();
  
    if (!facts) 
    {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${req.name}` });
    }
  
    if (index >= facts.funfacts.length) 
    {
      return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${req.name}` });
    }
    facts.funfacts.splice(index, 1);
    
    const result = await facts.save();
    res.json(result);
  };

module.exports = {
  getAllStates,
  getFunFacts,
  getState,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  createNewFunFacts,
  updateFunFacts,
  deleteFunFacts,
};