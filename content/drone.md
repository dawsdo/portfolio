Collision Analysis Drone System

Class capstone · Jan 2026 – May 2026 · Team of 5

When you train a computer vision model for crash scene analysis, the hardest part isn't the model. It's the data.

We were building a real-time dashboard for first responders. The premise: a DJI Tello EDU drone would feed live video to a Flask backend, a YOLOv8 model would detect vehicles in the frame, and a React dashboard would surface scene metrics — vehicle counts, crowd density, dynamic safety perimeters — to help responders make decisions on arrival. Five-person team, Agile cadence, capstone timeline.

My specialty was the computer vision pipeline — the model itself and the geometric analytics that ran on top of its output.

The dataset was the work

Off-the-shelf YOLO weights aren't trained to recognize crash scenes specifically. They know "car" and "truck" generically, but they haven't learned the visual signatures of collision damage, debris fields, or the unusual angles at which vehicles end up after an impact. To get there, I assembled a training set from three large public datasets of crash imagery, filtered to keep balanced classes of crash and non-crash scenes, and trained YOLOv8 from scratch on the combined set.

Training from scratch instead of fine-tuning meant the model could specialize on the exact visual problem we were solving rather than inheriting irrelevant priors from generic vehicle imagery. It also meant a longer iteration loop and more careful evaluation — checking that the model wasn't just learning artifacts of how each source dataset was photographed. The final model landed at 92% detection accuracy on our held-out crash scenes.

Geometric density, not heatmaps

The second piece I owned was the density and perimeter logic. Once YOLO returns bounding boxes for each detected vehicle, the question is: how do you go from "there are six vehicles in the frame" to "this scene needs a 40-foot safety perimeter"?

We chose a geometric approach over a heatmap or clustering one. The density signal was computed directly from bounding-box positions and sizes — counting detected objects per zone, weighting by box area, and triggering perimeter expansion when density crossed a threshold. The geometric approach kept the latency budget tight (no extra inference passes) and made the perimeter logic deterministic, which mattered for a tool meant to inform human decisions.

What I contributed outside my main lane

The team needed help across multiple surfaces, so I also pitched in on the Flask API that wrapped the DJI SDK and on the React dashboard that visualized the output. Owning both ends of the pipeline made the integration smoother — when the dashboard needed a new shape of telemetry, I could go reshape the API response myself rather than passing the request through three people.

What landed

By the end, the system held 30+ frames per second under live drone video, command-response latency stayed under 100ms, and the model hit our 92% accuracy target on held-out scenes. The dashboard rendered detection overlays, density estimates, and perimeter recommendations in real time.

What I'd do differently

Two things, in hindsight. First, I'd invest more time upfront on dataset hygiene — class balance and source-bias auditing — before training. We got lucky that the combined set was clean enough to train well, but a more rigorous pass would have given me sharper confidence in the accuracy number. Second, I'd version the model and dataset more explicitly. Toward the end of the project I had multiple weight files and couldn't always reconstruct exactly which training run produced which behavior. A simple manifest would have saved hours.

