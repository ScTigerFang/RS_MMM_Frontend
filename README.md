### Need to add Start up notes in readme

npm install
npm start

Deployments are done automatically as defined in the git workflows
these corrispond with a mix of the github secretes, which holds the deployment token find in azure for the static web page.

GoDaddy is my DNS Provider.


### QUERY FOR BACKEND INSERT
```sql
INSERT INTO Money_Making_Methods (
    Method_id, 
    Intensity, 
    Method, 
    Hourly_Profit, 
    Skill_or_Area, 
    Video_Link, 
    Notes, 
    Created_Datetime
)
VALUES (
    NEWID(), -- Automatically generates a new unique identifier
    5,       -- Example intensity level, replace with your value
    'The Gate of Elidiniss', -- Example method, replace with your value
    32580000,    -- Example hourly profit, replace with your value
    'Skilling/Bossing',  -- Example skill or area, replace with your value
    'http://example.com/video', -- Example video link, replace with your value
    '15 kills an hour, 72m in in commons 558,139 average loot per kill in commons 
280.2m 2,172m per kill with rares included', -- Example notes
    GETDATE()   -- Automatically sets the current datetime
);

```