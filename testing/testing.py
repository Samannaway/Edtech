from transformers import AutoTokenizer, AutoModelForTableQuestionAnswering
import pandas as pd

tokenizer = AutoTokenizer.from_pretrained("google/tapas-base-finetuned-wtq")
model = AutoModelForTableQuestionAnswering.from_pretrained("google/tapas-base-finetuned-wtq")  

data = {
    "Actors": ["Brad Pitt", "Leonardo Di Caprio", "George Clooney"],
    "Age": ["56", "45", "59"],
    "Number of movies": ["87", "53", "69"],
}
table = pd.DataFrame.from_dict(data).astype(str)
queries = ["How many movies has Brad Pitt played in?", "How old is Brad Pitt?"]

inputs = tokenizer(table=table, queries=queries, padding="max_length", return_tensors="pt")
outputs = model(**inputs)

predicted_answers, _ = tokenizer.convert_logits_to_predictions(
    inputs,
    outputs.logits.detach(),
    outputs.logits_aggregation.detach()
)

# Print the answers
for query, answer in zip(queries, predicted_answers):
    flat_answer = ', '.join([str(cell[0]) for cell in answer])  # Force str conversion
    print(f"Q: {query}")
    print(f"A: {flat_answer}\n")

