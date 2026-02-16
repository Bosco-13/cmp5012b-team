
``` Health App
sequenceDiagram
    actor Mary
    Participant Health App
    Participant Auth Service
    Mary ->> Health App:  Create username & password
    Health App ->> Auth Service: Create credentials
    Auth Service -->> Health App: Session/token
    Health App ->> Mary: What are your goals
    Mary ->> Health App: Input goals, height, weight, fitness levels.
    Health App ->> Mary: Output diet & fitness plans.


    
   
      
    
    
