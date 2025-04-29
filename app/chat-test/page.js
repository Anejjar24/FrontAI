"use client";
import React, { useState } from 'react';
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [query, setQuery] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCode('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({ query }));
      if (csvFile) {
        formData.append('csv_file', csvFile);
      }

      const response = await fetch('http://localhost:8000/api/generate-code', {
        method: 'POST',
        body: formData,
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (data.success) {
        setCode(data.code);
        if (data.result) {
          try {
            setResults(JSON.parse(data.result));
          } catch (e) {
            setResults({ output: data.result, errors: '', figures: [] });
          }
        }
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Error details:', error);
      setError('Erreur de connexion au serveur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Générateur de Scripts Python pour l'Analyse de Données</h1>
        <p>
          Formulez votre demande en langage naturel et téléchargez vos données (si nécessaire).
          Le système générera et exécutera automatiquement un script Python adapté.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="query-form">
        <div className="form-group">
          <label htmlFor="query">Que souhaitez-vous faire avec vos données?</label>
          <textarea
            id="query"
            value={query}
            onChange={handleQueryChange}
            placeholder="Ex: Entraîne un modèle Random Forest sur ce dataset, puis affiche l'importance des variables"
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="csvFile">Fichier de données (CSV): </label>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={loading || !query}>
          {loading ? 'Génération en cours...' : 'Générer le script'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {code && (
        <div className="results-container">
          <h2>Code Python généré:</h2>
          <div className="code-container">
            <SyntaxHighlighter language="python" style={vscDarkPlus}>
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {results && (
        <div className="execution-results">
          <h2>Résultats d'exécution:</h2>
          
          {results.errors && results.errors.length > 0 && (
            <div className="error-output">
              <h3>Erreurs:</h3>
              <pre>{results.errors}</pre>
            </div>
          )}
          
          {results.output && (
            <div className="console-output">
              <h3>Sortie console:</h3>
              <pre>{results.output}</pre>
            </div>
          )}
          
          {results.figures && results.figures.length > 0 && (
            <div className="figures-output">
              <h3>Visualisations:</h3>
              <div className="figures-gallery">
                {results.figures.map((figPath, index) => (
                  <div key={index} className="figure-container">
                    <img src={figPath} alt={`Figure ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;