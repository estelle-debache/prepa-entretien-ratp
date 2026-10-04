import { Route, Routes } from 'react-router'
import { Shell } from './ui/Shell'
import Home from './pages/Home'
import Parcours from './pages/Parcours'
import Fiche from './pages/Fiche'
import Memo from './pages/Memo'
import Donnees from './pages/Donnees'
import NotFound from './pages/NotFound'
import ReviserList from './pages/reviser/ReviserList'
import ReviserSection from './pages/reviser/ReviserSection'
import QuestionsList from './pages/questions/QuestionsList'
import QuestionDetail from './pages/questions/QuestionDetail'
import SituationsList from './pages/situations/SituationsList'
import SituationDetail from './pages/situations/SituationDetail'
import ReflexOrder from './pages/situations/ReflexOrder'
import RolePlayPage from './pages/roleplay/RolePlayPage'
import Hub from './pages/entrainement/Hub'
import Oral from './pages/entrainement/Oral'
import Ami from './pages/entrainement/Ami'
import Simulation from './pages/simulation/Simulation'
import Quiz from './pages/quiz/Quiz'
import RevisionRapide from './pages/RevisionRapide'

function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parcours" element={<Parcours />} />

        <Route path="/reviser" element={<ReviserList />} />
        <Route path="/reviser/:sectionId" element={<ReviserSection />} />

        <Route path="/questions" element={<QuestionsList />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />

        <Route path="/fiche" element={<Fiche />} />
        <Route path="/memo" element={<Memo />} />
        <Route path="/donnees" element={<Donnees />} />

        <Route path="/entrainement" element={<Hub />} />
        <Route path="/entrainement/oral/:id" element={<Oral />} />
        <Route path="/entrainement/ami/:id" element={<Ami />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/revision-rapide" element={<RevisionRapide />} />

        <Route path="/situations/ordre" element={<ReflexOrder />} />
        <Route path="/situations" element={<SituationsList />} />
        <Route path="/situations/:id" element={<SituationDetail />} />
        <Route path="/jeux-de-role/:id" element={<RolePlayPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  )
}

export default App
