import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchResponsesPending,
  fetchResponsesSuccess,
  fetchResponsesError,
  selectAllResponses,
  selectResponsesLoading,
  selectResponsesError,
  selectFormTitle,
  selectTotalResponses,
  getResponseColumns,
  FormResponseItem
} from '@/lib/features/viewResponses.slice/viewResponses';

// Define column type
interface TableColumn {
  id: string;
  header: string;
  accessorFn?: (row: FormResponseItem) => string;
}

// Define table components
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      {children}
    </table>
  </div>
);

const TableHeader = ({ columns }: { columns: TableColumn[] }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">
    <tr>
      {columns.map((column) => (
        <th
          key={column.id}
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
        >
          {column.header}
        </th>
      ))}
    </tr>
  </thead>
);

const TableBody = ({ 
  data, 
  columns,
  isLoading,
  error
}: { 
  data: FormResponseItem[], 
  columns: TableColumn[],
  isLoading: boolean,
  error: string | null
}) => {
  if (isLoading) {
    return (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td colSpan={columns.length || 1} className="px-6 py-4 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
              <span className="ml-2 dark:text-gray-300">Loading responses...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }
  
  if (error) {
    return (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td colSpan={columns.length || 1} className="px-6 py-4 text-center text-red-500 dark:text-red-400">
            {error}
          </td>
        </tr>
      </tbody>
    );
  }
  
  if (!data.length) {
    return (
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td colSpan={columns.length || 1} className="px-6 py-4 text-center dark:text-gray-300">
            No responses found
          </td>
        </tr>
      </tbody>
    );
  }
  
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {data.map((row, rowIndex) => (
        <tr key={row.responseId || rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
          {columns.map((column) => {
            const value = column.accessorFn ? column.accessorFn(row) : '';
            return (
              <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {value}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export function ResponsesTable({ formId }: { formId: string }) {
  const dispatch = useAppDispatch();
  const responses = useAppSelector(selectAllResponses);
  const isLoading = useAppSelector(selectResponsesLoading);
  const error = useAppSelector(selectResponsesError);
  const formTitle = useAppSelector(selectFormTitle);
  const totalResponses = useAppSelector(selectTotalResponses);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  
  useEffect(() => {
    const fetchResponses = async () => {
      if (!formId) return;
      
      try {
        dispatch(fetchResponsesPending());
        const response = await fetch(`/api/getResponses/${formId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          dispatch(fetchResponsesError(errorData.error || 'Failed to fetch responses'));
          return;
        }
        
        const data = await response.json();
        dispatch(fetchResponsesSuccess(data));
      } catch (err) {
        dispatch(fetchResponsesError('Network error while fetching responses'));
      }
    };
    
    fetchResponses();
  }, [dispatch, formId]);
  
  useEffect(() => {
    if (responses.length) {
      setColumns(getResponseColumns(responses) as TableColumn[]);
    } else {
      setColumns([]);
    }
  }, [responses]);
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-gray-100">{formTitle}</h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {totalResponses} {totalResponses === 1 ? 'response' : 'responses'} found
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 md:rounded-lg">
              <Table>
                {columns.length > 0 && <TableHeader columns={columns} />}
                <TableBody 
                  data={responses} 
                  columns={columns}
                  isLoading={isLoading}
                  error={error}
                />
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
