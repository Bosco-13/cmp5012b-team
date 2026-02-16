
``` mermaid
sequenceDiagram
    actor Mary
    Participant Frontend
    Participant Backend
    Participant Generate Plan
    Participant Database


    Mary->>Frontend:  Create username & password
    Frontend->>Backend: Create credentials
    Backend-->>Frontend: Session/token
    Frontend-->>Mary: What are your goals
    Mary->>Frontend: Input goals, height, weight, fitness levels.
    Frontend->>Database: Save goals, height, weight, and fitness levels.
    Frontend->>Generate Plan: Request fitness plan
    Generate Plan-->>Frontend: Generate fitness plan
    Generate Plan->>Database: Save fitness plan

    rect rgb(0,100,0)
    Mary->>Frontend: View fitness plan
    Frontend->>Database:Fetch fitness plan
    Database-->>Frontend: Output fitness plan
    Frontend-->>Mary: Output fitness plan
    end

    rect rgb(100,0,0)
    Mary->>Frontend:View fitness plan
    Frontend->>Database:Fetch fitness plan
    Database-->>Frontend: Error 404 - not found
    Frontend-->>Mary: Output error - fitness plan not found
    end

    Mary->>Frontend: Input food diary
    Frontend->>Generate Plan: Request diet plan
    Generate Plan-->>Frontend: Generate diet plan
    Generate Plan->>Database: Save diet plan
    Mary->>Frontend: View diet plan
    Frontend->>Database: Fetch diet plan
    Database-->>Mary: Output diet plan
    
```




    
   
      
    
    
