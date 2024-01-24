import sys
import json
import pandas as pd
import pickle
import os
# path: "/var/task/functions/api"

def load_model():
    current_directory = os.getcwd()
    # with open(os.path.join(current_directory, "/model.pkl"), "rb") as file:
    with open("/var/task/functions/api/model.pkl", "rb") as file:
        model = pickle.load(file)
    return model

def predict_proba(features):
    model = load_model()
    df = pd.DataFrame(json.loads(features))
    prediction_proba = model.predict_proba(df)[0]
    return prediction_proba

if __name__ == "__main__":
    features = json.loads(sys.argv[1])

    # result = predict_proba(features)
    
    # print(json.dumps(result.tolist())) 
    print(features) 