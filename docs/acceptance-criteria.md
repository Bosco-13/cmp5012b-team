# Acceptance Criteria

Use the Given / When / Then format.


## Core acceptance
-	Given the website outputs how close the user is to average weight, when a user wants to view that information, then the website outputs it on the screen.
-	Given the user isn’t logged in to the website, when the user tries to open the dashboard, then the website redirects the user to the login page.
-	Given the user doesn’t have an account on the website, when the user enters their information and clicks register, then the website updates the database and redirects the user to the dashboard.
-	Given a user account is in the database, when the user tries to delete their account then the website deletes the account alongside all the information about the user.

## Story: 1(Mary)
Core criterias for Mary:
 as Mary, i want more motivation to go to the gym so that i stay more active and am able to gain weight and muscle
- Given desire of Mary to gain more motivation
  When  motivational quotes or providing example of other people who went through the same trouble the Mary faces
  Then it would definately inspire Mary to get more active

 as Mary, i want a diet plan so that i eat less unhealthy food and regulate what im eating to help with my diet and energy levels to help increase my weight
 - Given desire of Mary to see the diet plan
   When system provides best set of meals based on her profile stats (like wieght) etc
   Then Mary can enter her weight change after some amount of time, for example each 2 weeks.
   
Edge criterias:
  as Mary, i want more motivation to go to the gym so that i stay more active and am able to gain weight and muscle
  - Given  desire of Mary to gain more motivation
    When quotes that were displayed are not relevant to ther Mary's case
    Then she can lose motivation instead of gaining it
  as Mary, i want a diet plan so that i eat less unhealthy food and regulate what im eating to help with my diet and energy levels to help increase my weight
  - Given desire to see the diet plan
    When system provides best set of meals but it might include something that she allergic to or cannot be consumed due to soem illnes
    Then Mary might not get any result or even worse make her health even worse

Core criteria for Dave:
as Dave. i want an app to track my progress within the gym so that im able to see what i did the last time i was in the gym and improve by increasing weight or reps
- Given desire of Dave for app to have exercise history so he could visualize his results based on the statistics 
  When system has feautre that allows user to input his number of sets and reps for each exercise and ability to save it for the future 
  Then with time Dave would be able to see how exactly his progress went throughout his past trainings.And then for each week Dave would be able to see general achievments and results displayed on the graphs.
  
Edge criteria for Dave:
- Given desire of Dave for app to have exercise history so he could visualize his results based on the statistics
  WHen data on the database would match the date of the training or any other confusion would happen
  Then Dave might not see realistic results and and his progress shown on the app wouldn't match reality.
  
- Given that a diet plan is displayed in the website for Jack, when Jack wants to view that information, then Jack can see a his personal meal plan

- Given that the UI is userfriendly, when Jack wants to navigate through the website to find a specific setting option, then Jack will find it easily.

- Given that data policies are trasparent, when Jack wants to understand how his data is used, then the website clearly communicates how his data is used, stored and kept for how long.

- Given that attendace at the gym is shown on the website, when Dave checks the website to see how many days his been at the gym this month, then the website shows a calendar highlighting the days he has been in.
-  

(Add additional sections for each key story.)
