import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

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
        """Add daily performance metrics"""
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        self.user_data["study_hours"].append(study)
        self.user_data["work_hours"].append(work)
        self.user_data["sleep_hours"].append(sleep)
        self.user_data["productivity_scores"].append(productivity)
        self.user_data["dates"].append(date)
        
    def train_model(self):
        """Train predictive model on collected data"""
        X = np.array([
            self.user_data["study_hours"],
            self.user_data["work_hours"], 
            self.user_data["sleep_hours"]
        ]).T
        y = np.array(self.user_data["productivity_scores"])
        self.model.fit(X, y)
    
    def predict_productivity(self, study, work, sleep):
        """Predict productivity score for given inputs"""
        return self.model.predict([[study, work, sleep]])[0]
    
    def generate_routine(self, available_hours=16):
        """Generate optimized daily routine"""
        avg_study = np.mean(self.user_data["study_hours"])
        avg_work = np.mean(self.user_data["work_hours"])
        avg_sleep = np.mean(self.user_data["sleep_hours"])
        
        total = avg_study + avg_work + avg_sleep
        study_pct = avg_study / total
        work_pct = avg_work / total 
        sleep_pct = avg_sleep / total
        
        last_week_prod = np.mean(self.user_data["productivity_scores"][-7:])
        if last_week_prod < 5:  # Productivity declining
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
        """Generate performance trend visualization"""
        plt.figure(figsize=(12, 6))
        dates = [datetime.strptime(d, "%Y-%m-%d") for d in self.user_data["dates"]]
        
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

def validate_input(prompt, min_val=0, max_val=24):
    """Ensure valid numeric input within range"""
    while True:
        try:
            value = float(input(prompt))
            if min_val <= value <= max_val:
                return value
            print(f"Please enter a value between {min_val} and {max_val}")
        except ValueError:
            print("Invalid input. Please enter a number.")

def main():
    print("\nPersonalized Daily Routine Generator")
    print("----------------------------------")
    print("Enter your daily performance data to get optimized recommendations\n")
    
    analyzer = PerformanceAnalyzer()
    days_to_input = int(validate_input("How many days of historical data do you want to enter? (Min 7): ", 7, 365))
    
    # Collect historical data
    for day in range(days_to_input):
        print(f"\n--- Day {day+1} ---")
        study = validate_input("Study hours: ", 0, 16)
        work = validate_input("Work hours: ", 0, 16)
        sleep = validate_input("Sleep hours: ", 3, 12)
        productivity = validate_input("Productivity score (1-10): ", 1, 10)
        analyzer.add_day_data(study, work, sleep, productivity)
    
    # Generate recommendations
    analyzer.train_model()
    routine = analyzer.generate_routine()
    
    print("\n=== Recommended Routine ===")
    print(f"Study: {routine['study_hours']} hours")
    print(f"Work: {routine['work_hours']} hours")
    print(f"Sleep: {routine['sleep_hours']} hours")
    print(f"\nPredicted Productivity: {routine['predicted_productivity']:.1f}/10")
    
    # Visualization
    if input("\nShow performance trends? (y/n): ").lower() == 'y':
        analyzer.visualize_trends()

if __name__ == "__main__":
    main()