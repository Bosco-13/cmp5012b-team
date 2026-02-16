``` mermaid
sequenceDiagram
    actor Dave
    participant Frontend
    participant Backend
    participant Database
    participant UI/UX
    Dave ->> Frontend: Inputs the data at the end of the training ot the app
    Frontend ->> Backend: Validiy check,checks whether data is correct has no issues
    Frontend ->> Backend: Sends HTTP requests for adding/removing training data
    Backend ->> Database: Saves data to the database
    Backend -->> Frontend: Sends appropriate response about success
    rect rgb(0,255,0)
    Frontend -->> Dave: Displays confirmation message
    end
    rect rgb(255,0,0)  
    Frontend -->> Dave: Displays an error
    end
    Dave ->> Frontend: Results button has been pressed
    Frontend ->> Backend: Sends HTTP request for retireving training progress
    Backend ->> Database: Retrieving rellavent data about Dave's results
    Backend -->> Frontend: Sends data
    Frontend -->> Dave: Displays appropriate digram/stats
```

