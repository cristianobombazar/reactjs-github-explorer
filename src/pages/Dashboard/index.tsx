import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const savedRepositories = localStorage.getItem(
      '@GitHubExplorer:repositories',
    );
    if (savedRepositories) {
      return JSON.parse(savedRepositories);
    }
    return [];
  });
  const [repository, setRepository] = useState(
    'cristianobombazar/spring-boot-event-listener',
  );

  useEffect(() => {
    localStorage.setItem(
      '@GitHubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!repository) {
      setInputError('Provide a repository name!');
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${repository}`);
      setRepositories([...repositories, response.data]);
      setRepository('');
      setInputError('');
    } catch (err) {
      setInputError('Repository does not exists. Provide a valid repository');
    }
  }

  return (
    <>
      <img src={logo} alt="GitHub Explorer" />
      <Title>Explore repositories on GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
          placeholder="Type here the name of repository"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((item: Repository) => (
          <Link key={item.full_name} to={`/repository/${item.full_name}`}>
            <img src={item.owner.avatar_url} alt={item.owner.login} />
            <div>
              <strong>{item.full_name}</strong>
              <p>{item.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
