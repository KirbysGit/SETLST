# SETLST

# CURRENT SUMMARY (05 / 30 / 2026 - 10:38 pm)

Design an app that connects to users location setting and preferred music app.

When a user's location registers that they have entered a gym's property. Associated with the user's profile is a connection to our social network feature, this will allows user's to connect with each other, providing potential connections to other social media sites as well. Users can only message each other if they are "friends" meaning they have accepted each other's friend requests.

A streak feature will be built into the app where a user can set goals for how often they want to go to the gym, you can allow others to see it, the streak counter only goes up if the user enters a gym, (gym specific to be discussed later). The streak refers more to if they're able to hit their desired goals, like 3 weeks of met goals, or something adjacent to that. The streak can be public or not depending on user.

There will also be a forum within the app (similar to reddit i think), where users can post questions about their workouts, diet, and any other gym related inquiries to be answerd by other users. Want to be able to handle avoiding posting specific words in the forum to promote a more positive environment, or if a user reaches a certain number of dislikes per post. 

The app will also have a push notification feature that can be toggled on by the user. The push notification can be set to a certain time aech day and pulls randomly from a list of motivational messages stating to get up and go to the gym.

## IMPORTANT :

In the apps terms & conditions an extra clause will be included stating that users do not mind other users BRIEFLY interacting with them in between sets, as to not hold up the questioned users workout.

Legal is very important for this app as we don't want to be liable for specific location based services, that's why with V1 we are taking a step back from the original map idea and focusing more on "Who's at your gym" and "What they're listening to", because once location is more active with a map feature, then we need to handle a lot of legal / liability cases.

## MAYBE :

Additionally, a user can message someone they are not friends with, however the message with arrive on the receivers end with a pop up message asking if they want to receive said message.

## LATER :

The app will have an uploading feature where user's can post their own gym content for others to see. If their profiel is set ot friends only, then it is private to themselves and their friends on the app. If a profile is public, anyone that has the app and is in the gym at the same respective time can see the profiles content.

Down the line we can monetize the app with a “reach out to a professional” feature where users can have a personal trainer help them create a workout program.

## QUESTIONS :

Do we want the app to be disabled completely outside of gym, or social media network still has access, just we separate a group of features between if they are at the gym and if not. 

### QUESTIONS FOR JIMMY (idea guy) :

**1. Do we want the app to feel premium and sleek, or more fun and playful?**

> Still needs a clearer answer. Current direction seems like a mix of both.

**2. Should the focus be a gym social network or a music-based gym companion?**

> Music-based gym companion. The social features should support the app, not make it feel like Instagram.

**3. What should the brand feel like: dark neon or minimalist black with color accents?**

> Still workshopping. Current logo options are 1, 6, or 10. Try adding the side lines from 6 onto 10, either in blue or with the jagged line from the original concept.

**4. Should the map be the main visual feature or a smaller live setlist board?**

> Needs more thought. The map is interesting, but location privacy is a common concern. It may work better as an abstract activity board instead of exact location tracking.

**5. Should the homepage be a live gym map, now-playing feed, profile/streak dashboard, or a mix?**

> A mix. Main focus should be activity and the now-playing feed, with streaks and other features lower on the page or available through scrolling.

**6. Should “Open to Chat” be central or more subtle?**

> More subtle. The toggle idea works well because making it too central could make the app feel dating-app adjacent.

**7. Do teal, blue, and purple feel right for the color direction?**

> Yes. Those colors fit the neon gym vibe, especially blue and purple.

**8. Is SETLST the intentional spelling?**

> Yes. SETLST is intentional. It keeps the music reference while looking more visually balanced: SET + LST.

## PAST :

Displaying a crude map on the apps homepage of a drawing depicting the perimeter of the gym, dot / pfp's indicating users, and connected info such as the song the user is listening to next to their dot. As long as app is open or running the background other users can see one another's current song as well as the approximate location of the user inside the gym, to remove onself from the map, adjust settings, or quit the app.


# VERSIONS 

## V1 :

### Success Criteria

The idea with the initial skeleton and set up is that we just want to help users ee who is active at their gym, what they are listening to, and whether they are open to light social interaction.

For V1, the app will avoid exact location tracking or a live gym map. Instead our focus will be on a safer "active at your gym" sort of experience. Users can see nearby active members, current songs, gym streaks, and basic profile information, but not precise locations inside of the gym.

The core dashboard will focus on : 
- who is currently active at the gym?
- what people are listening to?
- friend requests and limited messaging?
- gym streaks and weekly goals
- optional visibility settings

Users will control whether they appear active and what information is shown. Messaging will be mainly friend based, with possible message requests for non-friends.

The app should feel like a music-first companion with social features, not a full Instagram-style fitness network.

#### Concerns RN : 

How to connect music to app ? Like Spotify / Apple Music / SoundCloud API 
How to deem bounds of a gym ? Google Maps API Data ? 

Mental Power Flow Rn : 

Home Screen Prompting Account Creation -> Login / Sign Up / Auth Flow (Verification FS) -> Account Set Up W/ Profile Info & Preferences -> Dashboard -> Connect W/ Others

Main Flow :

                                   Home Screen 
                                /               \
                             Sign Up           Log In
                                |                |
                           Verification          |
                                |                |
                           Profile Setup         |
                                |                |
                                 \              /
                                  Loading Screen
                                        |
                                    Dashboard
                     /          /       |       \            \
                  Home      Friends    Msgs    Community    Profile
                            