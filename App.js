import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Anthropic } from '@anthropic-ai/sdk';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [email, setEmail] = useState('');
  const [factors, setFactors] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your Claude API key');
      return;
    }
    setShowApiKeyInput(false);
  };

  const handleGenerateResponses = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a customer email');
      return;
    }

    setLoading(true);
    setError('');
    setResponses([]);

    try {
      const client = new Anthropic({
        apiKey: apiKey,
      });

      let prompt = `You are a helpful customer service representative. Generate 2-3 different response options ONLY. Do not include any preamble or explanation text. Each response should:
- Be professional and friendly
- Address the customer's concern directly
- Be solution-focused
- Be concise (2-3 sentences max)

Format: Start each response on a new line with "1.", "2.", "3.", etc.

Customer Email:
${email}`;

      if (factors.trim()) {
        prompt += `

Important Context & Constraints:
${factors}

Please take these constraints into account when generating your responses.`;
      }

      const message = await client.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';
      const lines = responseText.split('\n').filter((line) => line.trim());

      // Filter to only numbered responses
      const filteredResponses = lines.filter((line) => /^\d+\.\s/.test(line.trim()));

      if (filteredResponses.length === 0) {
        setResponses(lines);
      } else {
        setResponses(filteredResponses);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setEmail('');
    setFactors('');
    setResponses([]);
    setError('');
  };

  const handleChangeApiKey = () => {
    setShowApiKeyInput(true);
    setApiKey('');
  };

  if (showApiKeyInput) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.apiKeyContainer}>
          <Text style={styles.title}>🤖 Steam CS Demo</Text>
          <Text style={styles.subtitle}>AI Customer Service Response Generator</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Claude API Key</Text>
            <Text style={styles.cardDescription}>
              Get your API key from{'\n'}
              <Text style={styles.link}>https://claude.ai/settings/api</Text>
            </Text>

            <TextInput
              style={styles.apiKeyInput}
              placeholder="sk-ant-api03-..."
              placeholderTextColor="#999"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry={true}
              editable={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleSaveApiKey}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.note}>
              Your API key is stored locally on this device only. Never shared or stored on servers.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🤖 Steam CS Demo</Text>
            <Text style={styles.headerSubtitle}>AI Customer Service Responses</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer email..."
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              multiline
              numberOfLines={4}
              editable={!loading}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Context & Constraints (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., issue no refund, customer is VIP..."
              placeholderTextColor="#999"
              value={factors}
              onChangeText={setFactors}
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleGenerateResponses}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Generate Responses</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleClear}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleChangeApiKey}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Change API Key</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {responses.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI-Suggested Responses</Text>
              {responses.map((response, index) => (
                <View key={index} style={styles.responseItem}>
                  <Text style={styles.responseLabel}>Option {index + 1}</Text>
                  <Text style={styles.responseText}>
                    {response.replace(/^\d+\.\s*/, '')}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {!loading && responses.length === 0 && !error ? (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Generated responses will appear here
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  responseItem: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  placeholder: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  apiKeyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  link: {
    color: '#667eea',
    textDecorationLine: 'underline',
  },
  apiKeyInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
