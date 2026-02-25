
``` mermaid
sequenceDiagram
    actor Mary
    Participant Frontend
    Participant Backend
    Participant Generate Plan
    Participant Database


    Mary->>Frontend:  Create username & password
    activate Frontend
    Frontend->>Backend: Create credentials
    activate Backend
    Backend-->>Frontend: Session/token
    deactivate Backend
    Frontend-->>Mary: What are your goals
    deactivate Frontend
    Mary->>Frontend: Input goals, height, weight, fitness levels.
    activate Frontend
    activate Frontend
    Frontend->>Database: Save goals, height, weight, and fitness levels.
    activate Database
    activate Database
    Frontend->>Generate Plan: Request fitness plan
    activate Generate Plan
    Generate Plan-->>Frontend: Generate fitness plan
    deactivate Generate Plan
    Generate Plan->>Database: Save fitness plan

    rect rgb(0,255,0)
    Mary->>Frontend: View fitness plan
    Frontend->>Database:Fetch fitness plan
    Database-->>Frontend: Output fitness plan
    deactivate Database
    Frontend-->>Mary: Output fitness plan
    deactivate Frontend
    end

    rect rgb(255,0,0)
    Mary->>Frontend:View fitness plan
    Frontend->>Database:Fetch fitness plan
    Database-->>Frontend: Error 404 - not found
    deactivate Database
    Frontend-->>Mary: Output error - fitness plan not found
    deactivate Frontend
    end

    Mary->>Frontend: Input food diary
    activate Frontend
    Frontend->>Generate Plan: Request diet plan
    activate Generate Plan
    Generate Plan-->>Frontend: Generate diet plan
    Generate Plan->>Database: Save diet plan
    deactivate Generate Plan
    activate Database
    Mary->>Frontend: View diet plan
    Frontend->>Database: Fetch diet plan
    Database-->>Mary: Output diet plan
    deactivate Database
    deactivate Frontend
    
```
---

``` mermaid
sequenceDiagram
    actor Dave
    participant Frontend
    participant Backend
    participant Database
    participant UI/UX
    Dave ->> Frontend: Inputs the data at the end of the training ot the app
    activate Frontend
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
    deactivate Frontend
```

---
```mermaid
sequenceDiagram
    actor Jack
    participant Frontend
    participant Backend
    participant Database
    Jack ->> Frontend: click to view health condition page
    activate Frontend
    activate Frontend
    Frontend ->> Backend: send request to get Jack's data
    activate Backend
    activate Backend
    Backend ->> Database: query Jack's health data
    activate Database
    activate Database
    rect rgb(0, 255, 0)
    Note right of Jack: Happy path
    Database -->> Backend: return Jack's health data
    deactivate Database
    Backend -->> Frontend: render Jack's health data
    deactivate Backend
    Frontend -->> Jack: display health condition page to Jack
    deactivate Frontend
    end
    rect rgb(255, 0, 0)
    Note right of Jack: Unhappy path: Data not found
    Database -->> Backend: return error message, data not found
    deactivate Database 
    Backend -->> Frontend: render data not found message
    deactivate Backend
    Frontend -->> Jack: display error message
    deactivate Frontend
    end
```


    
   
      
    
    
