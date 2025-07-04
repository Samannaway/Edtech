import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
from sklearn.linear_model import LinearRegression
from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

# -------------------- T5 SETUP --------------------
t5_model_name = "t5-base"
t5_tokenizer = T5Tokenizer.from_pretrained(t5_model_name)
t5_model = T5ForConditionalGeneration.from_pretrained(t5_model_name)

def answer_text_question(prompt: str):
    input_text = f"question: {prompt} </s>"
    input_ids = t5_tokenizer.encode(input_text, return_tensors="pt")
    outputs = t5_model.generate(input_ids, max_length=100)
    return t5_tokenizer.decode(outputs[0], skip_special_tokens=True)

# -------------------- PERFORMANCE MODEL --------------------
class PerformanceAnalyzer:
    def __init__(self):
        self.user_data = {
            "study_hours": [],
            "work_hours": [],
            "sleep_hours": [],
            "productivity_scores": [],
            "dates": []
        }
        self.model = LinearRegression()
        
    def add_day_data(self, study, work, sleep, productivity, date=None):
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        self.user_data["study_hours"].append(study)
        self.user_data["work_hours"].append(work)
        self.user_data["sleep_hours"].append(sleep)
        self.user_data["productivity_scores"].append(productivity)
        self.user_data["dates"].append(date)
        
    def train_model(self):
        X = np.array([
            self.user_data["study_hours"],
            self.user_data["work_hours"],
            self.user_data["sleep_hours"]
        ]).T
        y = np.array(self.user_data["productivity_scores"])
        self.model.fit(X, y)
    
    def predict_productivity(self, study, work, sleep):
        return self.model.predict([[study, work, sleep]])[0]
    
    def generate_routine(self, available_hours=16):
        avg_study = np.mean(self.user_data["study_hours"])
        avg_work = np.mean(self.user_data["work_hours"])
        avg_sleep = np.mean(self.user_data["sleep_hours"])
        
        total = avg_study + avg_work + avg_sleep
        study_pct = avg_study / total
        work_pct = avg_work / total 
        sleep_pct = avg_sleep / total
        
        last_week_prod = np.mean(self.user_data["productivity_scores"][-7:])
        if last_week_prod < 5:
            study_pct *= 0.9
            sleep_pct *= 1.1
        
        recommended_study = round(available_hours * study_pct, 1)
        recommended_work = round(available_hours * work_pct, 1)
        recommended_sleep = round(available_hours * sleep_pct, 1)
        
        if recommended_sleep < 6:
            difference = 6 - recommended_sleep
            recommended_sleep = 6
            recommended_study -= difference/2
            recommended_work -= difference/2
        
        return {
            "study_hours": max(0, recommended_study),
            "work_hours": max(0, recommended_work),
            "sleep_hours": max(6, recommended_sleep),
            "predicted_productivity": self.predict_productivity(
                recommended_study, recommended_work, recommended_sleep
            )
        }

    def visualize_trends(self):
        dates = [datetime.strptime(d, "%Y-%m-%d") for d in self.user_data["dates"]]
        plt.figure(figsize=(12, 6))
        
        plt.subplot(2, 2, 1)
        plt.plot(dates, self.user_data["productivity_scores"], 'b-o')
        plt.title("Productivity Trend")
        
        plt.subplot(2, 2, 2)
        plt.bar(dates, self.user_data["study_hours"], color='g')
        plt.title("Study Hours")
        
        plt.subplot(2, 2, 3)
        plt.bar(dates, self.user_data["work_hours"], color='r')
        plt.title("Work Hours")
        
        plt.subplot(2, 2, 4)
        plt.bar(dates, self.user_data["sleep_hours"], color='m')
        plt.title("Sleep Hours")
        
        plt.tight_layout()
        plt.show()

# -------------------- VALIDATION --------------------
def validate_input(prompt, min_val=0, max_val=24):
    while True:
        try:
            value = float(input(prompt))
            if min_val <= value <= max_val:
                return value
            print(f"Enter a value between {min_val} and {max_val}")
        except ValueError:
            print("Invalid input. Please enter a number.")

# -------------------- MAIN APP --------------------
def main():
    print("\n📚 Welcome to the Student AI Assistant")
    print("=====================================")
    
    analyzer = PerformanceAnalyzer()
    days = int(validate_input("How many days of data do you want to enter? (Min 7): ", 7, 365))
    
    for i in range(days):
        print(f"\n--- Day {i+1} ---")
        study = validate_input("Study hours: ", 0, 16)
        work = validate_input("Work hours: ", 0, 16)
        sleep = validate_input("Sleep hours: ", 3, 12)
        productivity = validate_input("Productivity score (1-10): ", 1, 10)
        analyzer.add_day_data(study, work, sleep, productivity)
    
    analyzer.train_model()
    routine = analyzer.generate_routine()
    
    print("\n📈 Personalized Routine Suggestion:")
    print(f"🧠 Study: {routine['study_hours']} hrs")
    print(f"💼 Work: {routine['work_hours']} hrs")
    print(f"😴 Sleep: {routine['sleep_hours']} hrs")
    print(f"🔮 Predicted Productivity: {routine['predicted_productivity']:.1f}/10")
    
    if input("\nWould you like to visualize your trends? (y/n): ").lower() == 'y':
        analyzer.visualize_trends()
    
    # Q&A Section
    print("\n💬 Ask me anything about your progress or studies!")
    while True:
        user_q = input("Q (or type 'quit'): ")
        if user_q.strip().lower() == "quit":
            break
        answer = answer_text_question(user_q)
        print(f"A: {answer}")

# -------------------- START APP --------------------
if __name__ == "__main__":
    main()
