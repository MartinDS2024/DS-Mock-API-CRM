const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Add this AFTER Swagger
/*app.use(authMiddleware);*/

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};


const simulatedDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const simulateErrorOrDelay = async (req, res, next) => {
  const id = req.query.DebtID || req.body.DebtID || req.query.AccountID || req.body.AccountID || req.query.LinkID;
  if (id === '500') {
    return res.status(500).json({ message: 'Simulated server error' });
  }
  if (id === 'delay') {
    await simulatedDelay(1000);
  }
  next();
};

app.use(simulateErrorOrDelay);

const simulateID = () => Math.floor(100000 + Math.random() * 900000);

// GET endpoints

// GET Account (dynamic by DebtID)
app.get('/api/Account', (req, res) => {
    const { DebtID } = req.query; // Fetch the DebtID from the query parameter
    const account = db.accounts[DebtID]; // Fetch the account from the mock data using DebtID
    if (account) {
        res.json({ status: 'success', data: account }); // Return the account data if found
    } else {
        res.status(404).json({ message: 'Account not found' }); // If no account found, return 404
    }
});

/*
app.get('/api/Account', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_Account.json')));
    res.json({ status: 'success', data });
}); */

app.get('/api/LinkedAccounts', (req, res) => {
    const { LinkID } = req.query;
    const data = db.linkedAccounts[LinkID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No linked accounts found' });
});

/*
app.get('/api/LinkedAccounts', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_LinkedAccounts.json')));
    res.json({ status: 'success', data });
});*/

app.get('/api/Document', (req, res) => {
    const { DebtID } = req.query;
    const data = db.documents[String(DebtID)];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No documents found' });
});
/*

app.get('/api/Document', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_Document.json')));
    res.json({ status: 'success', data });
}); */

app.get('/api/ContactDetails', (req, res) => {
    const { DebtID } = req.query;
    const data = db.contactDetails[String(DebtID)];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No contact details found' });
});

/*
app.get('/api/ContactDetails', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_ContactDetails.json')));
    res.json({ status: 'success', data });
}); */

app.get('/api/Transaction', (req, res) => {
    const { DebtID } = req.query;
    const data = db.transactions[DebtID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No transactions found' });
});

/*
app.get('/api/Transaction', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_Transaction.json')));
    res.json({ status: 'success', data });
}); */

/*
app.get('/api/PaymentPlan', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_PaymentPlan.json')));
    res.json({ status: 'success', data });
}); */


app.get('/api/BreathingSpace', (req, res) => {
    const { DebtID } = req.query;
    const data = db.breathingSpaces[DebtID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No breathing space data found' });
});

/*
app.get('/api/BreathingSpace', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_BreathingSpace.json')));
    res.json({ status: 'success', data });
}); */


app.get('/api/CallBack', (req, res) => {
    const { DebtID } = req.query;
    const data = db.callbacks[DebtID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No callback found' });
});

/*
app.get('/api/CallBack', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_CallBack.json')));
    res.json({ status: 'success', data });
}); */


app.get('/api/Tasks', (req, res) => {
    const { DebtID } = req.query;
    const data = db.tasks[DebtID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No tasks found' });
});


/*
app.get('/api/Tasks', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_Tasks.json')));
    res.json({ status: 'success', data });
});*/

app.get('/Memo', (req, res) => {
    const { DebtID } = req.query;
    const data = db.memos[DebtID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No memo found' });
});
/*
app.get('/Memo', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'Memo.json')));
    res.json({ status: 'success', data });
}); */


app.get('/api/IncomeExpenditure', (req, res) => {
    const { DebtID } = req.query;
    const data = db.incomeExpenditure[DebtID];
    if (data) res.json({ status: 'success', data });
    else res.status(404).json({ message: 'No income/expenditure found' });
});

/*
app.get('/api/IncomeExpenditure', (req, res) => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'responses', 'api_IncomeExpenditure.json')));
    res.json({ status: 'success', data });
}); */

/*
// POST endpoints
app.post('/api/Document', (req, res) => res.status(201).json({ status: 'success', data: { ...req.body, DocumentID: simulateID() }}));
app.post('/api/LinkedAccounts', (req, res) => res.status(201).json({ status: 'success', data: req.body }));
app.post('/api/ContactDetails', (req, res) => res.status(201).json({ status: 'success', data: req.body }));
app.post('/api/PaymentPlan', (req, res) => res.status(201).json({ status: 'success', data: { ...req.body, ArrangementID: simulateID() }}));
app.post('/api/BreathingSpace', (req, res) => res.status(201).json({ status: 'success', data: req.body }));
app.post('/api/CallBack', (req, res) => res.status(201).json({ status: 'success', data: { ...req.body, CallbackID: simulateID() }}));
app.post('/api/Tasks', (req, res) => res.status(201).json({ status: 'success', data: { ...req.body, TaskID: simulateID() }}));
app.post('/api/IncomeExpenditure', (req, res) => res.status(201).json({ status: 'success', data: { ...req.body, SubmissionID: simulateID() }}));
app.post('/api/Payment', (req, res) => res.status(201).json({ status: 'success', data: req.body }));
app.post('/api/Memo', (req, res) => res.status(201).json({ status: 'success', data: { ...req.body, MemoID: simulateID() }}));
*/



// Load dynamic mock data
let db = require('./mockData.json');

// GET Account (dynamic by DebtID)
app.get('/api/Account', (req, res) => {
    const { DebtID } = req.query;
    const account = db.accounts[DebtID];
    if (account) {
        res.json({ status: 'success', data: account });
    } else {
        res.status(404).json({ message: 'Account not found' });
    }
});

// GET PaymentPlan (dynamic)
app.get('/api/PaymentPlan', (req, res) => {
    const { DebtID } = req.query;
    const plan = db.paymentPlans[DebtID];
    if (plan) {
        res.json({ status: 'success', data: plan });
    } else {
        res.status(404).json({ message: 'No plan found' });
    }
});




app.post('/api/Document', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID is required' });

    const newDocument = { ...req.body, DocumentID: simulateID() };
    if (!db.documents[String(DebtID)]) db.documents[String(DebtID)] = [];
    db.documents[String(DebtID)].push(newDocument);

    res.status(201).json({ status: 'success', data: newDocument });
});

app.post('/api/ContactDetails', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID is required' });

    db.contactDetails[String(DebtID)] = req.body;

    res.status(201).json({ status: 'success', data: req.body });
});

app.post('/api/CallBack', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID is required' });

    const newCallback = { ...req.body, CallbackID: simulateID() };
    db.callbacks[String(DebtID)] = newCallback;

    res.status(201).json({ status: 'success', data: newCallback });
});
app.post('/api/Tasks', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID is required' });

    const newTask = { ...req.body, TaskID: simulateID() };
    if (!db.tasks[String(DebtID)]) db.tasks[String(DebtID)] = [];
    db.tasks[String(DebtID)].push(newTask);

    res.status(201).json({ status: 'success', data: newTask });
});
app.post('/api/IncomeExpenditure', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID is required' });

    const newSubmission = { ...req.body, SubmissionID: simulateID() };
    db.incomeExpenditure[String(DebtID)] = newSubmission;

    res.status(201).json({ status: 'success', data: newSubmission });
});
app.post('/api/Memo', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID is required' });

    const newMemo = { ...req.body, MemoID: simulateID() };
    if (!db.memos[String(DebtID)]) db.memos[String(DebtID)] = [];
    db.memos[String(DebtID)].push(newMemo);

    res.status(201).json({ status: 'success', data: newMemo });
});

app.post('/api/Payment', (req, res) => {
    const { DebtID, Amount, PaymentDate, PaymentReference } = req.body;
    if (!DebtID || !Amount) {
        return res.status(400).json({ message: 'DebtID and Amount are required' });
    }

    const payment = {
        PaymentID: simulateID(),
        DebtID,
        Amount,
        PaymentDate: PaymentDate || new Date().toISOString(),
        PaymentReference: PaymentReference || `REF-${simulateID()}`
    };

    // Store payment
    if (!db.payments) db.payments = {};
    if (!db.payments[String(DebtID)]) db.payments[String(DebtID)] = [];
    db.payments[String(DebtID)].push(payment);

    // Add to transaction history
    const transaction = {
        DebtID,
        Date: payment.PaymentDate,
        Amount,
        CreditDebit: "Credit",
        Transactiontype: "Card",
        Description: `Payment - Ref ${payment.PaymentReference}`
    };
    if (!db.transactions[String(DebtID)]) db.transactions[String(DebtID)] = [];
    db.transactions[String(DebtID)].push(transaction);

    // Subtract from balance
    const account = db.accounts[String(DebtID)];
    if (account && typeof account.Balance === 'number') {
        account.Balance = parseFloat((account.Balance - Amount).toFixed(2));
    }

    res.status(201).json({ status: 'success', data: payment });
});


app.post('/api/LinkedAccounts', (req, res) => {
    const { DebtID, LinkID } = req.body;
    if (!DebtID || !LinkID) return res.status(400).json({ message: 'DebtID and LinkID required' });

    if (!db.linkedAccounts[LinkID]) db.linkedAccounts[LinkID] = [];

    const newLinkedEntry = { DebtID, LinkID, LinkedAt: new Date().toISOString() };
    db.linkedAccounts[LinkID].push(newLinkedEntry);

    res.status(201).json({ status: 'success', data: newLinkedEntry });
});

// POST PaymentPlan (adds or replaces plan)
/*
app.post('/api/PaymentPlan', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID required' });
    db.paymentPlans[DebtID] = req.body;
    res.status(201).json({ status: 'success', data: req.body });
}); */

app.post('/api/PaymentPlan', (req, res) => {
    const { DebtID } = req.body;
    if (!DebtID) return res.status(400).json({ message: 'DebtID required' });

    const defaultPlan = {
        ArrangementID: simulateID(),
        SettlementAmount: 0.00,
        Frequency: "Monthly",
        PlanType: "Arrangement",
        SetupDate: new Date().toISOString(),
        StartDate: new Date().toISOString(),
        LastPaymentDate: null,
        LastPaymentAmount: 0.0,
        PlanInstallmentDate: new Date().toISOString(),
        NumberOfPayments: 0,
        NumberOfPaymentsMadeOnPlan: 0,
        PaymentType: "Direct Debit",
        FailedPlanFlag: false,
        FirstInstallmentMade: false,
        FailedPlanDate: "",
        ReviewDate: null
    };

    const plan = {
        ...defaultPlan,
        ...req.body,
        ArrangementID: simulateID(),
        DebtID
    };

    db.paymentPlans[String(DebtID)] = plan;

    res.status(201).json({ status: 'success', data: plan });
});


// Reset data for a specific DebtID or reset all data
app.post('/api/reset', (req, res) => {
    const { DebtID } = req.body;

    if (DebtID) {
        // Reset data for specific DebtID
        if (db.accounts[DebtID]) {
            delete db.accounts[DebtID];
            delete db.documents[DebtID];
            delete db.contactDetails[DebtID];
            delete db.paymentPlans[DebtID];
            delete db.transactions[DebtID];
            delete db.breathingSpaces[DebtID];
            delete db.callbacks[DebtID];
            delete db.tasks[DebtID];
            delete db.incomeExpenditure[DebtID];
            res.status(200).json({ status: 'success', message: `Data for DebtID ${DebtID} has been reset.` });
        } else {
            res.status(404).json({ message: `DebtID ${DebtID} not found.` });
        }
    } else {
        // Reset all data
        db = require('./mockData.json');  // Re-load default data
        res.status(200).json({ status: 'success', message: 'All data has been reset.' });
    }
});

// Snapshot endpoint to return current state of mock data
app.get('/api/snapshot', (req, res) => {
    res.json({ status: 'success', data: db });
});


// Now start the server

app.listen(port, () => {
    console.log(`Mock API server running at http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/docs`);
});