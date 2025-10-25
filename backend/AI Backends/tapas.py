from transformers import TapasTokenizer, TapasForQuestionAnswering
import pandas
import os

tokenizer = TapasTokenizer.from_pretrained("google/tapas-base")

# config = TapasConfig("google-base-finetuned-wikisql-supervised")
model = TapasForQuestionAnswering.from_pretrained("google/tapas-base-finetuned-wtq")

file = os.path.join(os.path.dirname(__file__), "MOCK_DATA.csv")
query = input("enter a query")

df = pandas.read_csv(file)
df = df.fillna("").astype(str)


inputs = tokenizer(table=df, queries=query, padding="max_length", return_tensors="pt")
outputs= model(**inputs)

predicted_coordinates, predicted_aggregation_indices = tokenizer.convert_logits_to_predictions(
    inputs, outputs.logits.detach(), outputs.logits_aggregation.detach()
)


id2aggregation = {0: "NONE", 1: "SUM", 2: "AVERAGE", 3: "COUNT"}
aggregation_predictions_string = [id2aggregation[x] for x in predicted_aggregation_indices]


answers = []
for coordinates in predicted_coordinates:
    if len(coordinates) == 1:
        # only a single cell:
        answers.append(df.iat[coordinates[0]])
    else:
        # multiple cells
        cell_values = []
        for coordinate in coordinates:
            cell_values.append(df.iat[coordinate])
        answers.append(", ".join(cell_values))

# display(df)
print("")
for query, answer, predicted_agg in zip(query, answers, aggregation_predictions_string):
    # print(query)
    if predicted_agg == "NONE":
        print("Predicted answer: " + answer)
    else:
        print("Predicted answer: " + predicted_agg + " > " + answer)

print(df)