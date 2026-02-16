
``` mermaid
sequenceDiagram
    actor Mary
    Participant Health App
    Participant Auth Service
    Participant Generate Plan
    Mary->>Health App:  Create username & password
    Health App->>Auth Service: Create credentials
    Auth Service-->>Health App: Session/token
    Health App-->>Mary: What are your goals
    Mary->>Health App: Input goals, height, weight, fitness levels.
    Health App->>Generate Plan: Request fitness plan
    Generate Plan-->>Health App: Generate fitness plan
    Health App-->>Mary: Output fitness plan.
    Mary->>Health App: Input food diary
    Health App->>Generate Plan: Request diet plan
    Generate Plan-->>Health App: Generate diet plan
    Health App-->>Mary: Output diet plan
    
```




    
   
      
    
    
