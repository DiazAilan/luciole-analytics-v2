import { useCallback } from 'react';
import { FileUpload } from '@design-system-rte/react';
import type { ParseResult, TaskRow } from '../types';
import { parseCSV } from '../utils/csvParser';

interface FileInputProps {
  onLoad: (tasks: TaskRow[], info: Omit<ParseResult, 'tasks'>) => void;
  onError?: (message: string) => void;
}

export function FileInput({ onLoad, onError }: FileInputProps) {
  const handleChange = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith('.csv')) {
        onError?.('Veuillez sélectionner un fichier CSV.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) {
          onError?.('Impossible de lire le fichier.');
          return;
        }
        try {
          const { tasks, skippedRows, warnings } = parseCSV(text);
          if (tasks.length === 0) {
            onError?.('Aucune donnée valide trouvée dans le fichier.');
            return;
          }
          onLoad(tasks, { skippedRows, warnings });
        } catch (err) {
          onError?.(err instanceof Error ? err.message : 'Erreur de parsing.');
        }
      };
      reader.onerror = () => onError?.('Erreur lors de la lecture du fichier.');
      reader.readAsText(file, 'UTF-8');
    },
    [onLoad, onError]
  );

  return (
    <FileUpload
      id="csv-upload"
      label="Import de données"
      accept=".csv"
      buttonLabel="Importer un fichier CSV"
      assistiveTextLabel="Format attendu : colonnes Tâche, Categorie, Type, Release"
      onChange={handleChange}
    />
  );
}
