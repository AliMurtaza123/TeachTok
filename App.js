import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const App = () => {
    const [questions, setQuestions] = useState([]);
    const [seconds, setSeconds] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        fetchQuestions();
        const timer = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://cross-platform.rp.devfactory.com/for_you');
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            if (data && data.type === 'mcq') {
                setQuestions([data]);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            Alert.alert('Error', 'Failed to fetch questions');
        }
    };



    


const revealAnswer = async (id, selectedOption) => {
  try {
      const response = await fetch(`https://cross-platform.rp.devfactory.com/reveal?id=${id}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Reveal answer response data:', data); // Log the response data for debugging

      // Verify the response structure and expected properties
      if (data && data.id && data.correct_options && data.correct_options.length > 0) {
          const correctAnswer = data.correct_options.find(option => option.id === selectedOption);
          if (correctAnswer) {
            setCorrectCount(prevCount => prevCount + 1);
              Alert.alert('Correct!', `The correct answer is ${correctAnswer.answer}`);
              setTimeout(() => {
                fetchQuestions();
            }, 2000); // 2000 milliseconds delay
          } else {
            const correctAnswerText = data.correct_options[0].answer;
              Alert.alert('Incorrect', `The correct answer is ${correctAnswerText}`);
              setTimeout(() => {
                fetchQuestions();
            }, 2000); // 2000 milliseconds delay
          }
      } else {
          throw new Error('Invalid data format');
      }

      // Fetch new questions after revealing the answer
     //fetchQuestions();
  } catch (error) {
      console.error('Error revealing answer:', error);
      Alert.alert('Error', 'Failed to reveal answer');
  }
};








    return (
        <View style={styles.container}>
            <Text style={styles.timer}>Time Spent: {seconds} seconds</Text>
            <Text style={styles.correctCount}>Correct Answers: {correctCount}</Text>
            <ScrollView style={styles.scrollView}>
                {questions.map((question) => (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.question}>{question.question}</Text>
                        {question.options.map((option, index) => (
                            <TouchableOpacity
                                key={option.id}
                                style={styles.option}
                                onPress={() => revealAnswer(question.id, option.id)}
                            >
                                <Text>{option.answer}</Text>
                            </TouchableOpacity>
                        ))}
                        <Text style={styles.info}>Author: {question.user.name}</Text>
                        <Text style={styles.info}>Playlist: {question.playlist}</Text>
                        <Text style={styles.info}>Description: {question.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    timer: {
        fontSize: 20,
        marginBottom: 20,
    },
    scrollView: {
        marginBottom: 20,
    },
    questionContainer: {
        marginBottom: 20,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    option: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
    },
    info: {
        marginTop: 10,
    },
});

export default App;
