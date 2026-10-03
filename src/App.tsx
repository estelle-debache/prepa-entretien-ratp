import { Route, Routes } from 'react-router'
import { Shell } from './ui/Shell'
import Home from './pages/Home'
import Fiche from './pages/Fiche'
import Memo from './pages/Memo'
import Donnees from './pages/Donnees'
import Entrainement from './pages/Entrainement'
import ComingSoon from './pages/ComingSoon'
import NotFound from './pages/NotFound'
import ReviserList from './pages/reviser/ReviserList'
import ReviserSection from './pages/reviser/ReviserSection'
import QuestionsList from './pages/questions/QuestionsList'
import QuestionDetail from './pages/questions/QuestionDetail'
import SituationsList from './pages/situations/SituationsList'
import SituationDetail from './pages/situations/SituationDetail'
import RolePlayPage from './pages/roleplay/RolePlayPage'

function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/reviser" element={<ReviserList />} />
        <Route path="/reviser/:sectionId" element={<ReviserSection />} />

        <Route path="/questions" element={<QuestionsList />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />

        <Route path="/fiche" element={<Fiche />} />
        <Route path="/memo" element={<Memo />} />
        <Route path="/donnees" element={<Donnees />} />

        <Route path="/entrainement" element={<Entrainement />} />
        <Route path="/entrainement/oral/:id" element={<ComingSoon title="Entraînement à l'oral" />} />
        <Route path="/entrainement/ami/:id" element={<ComingSoon title="Mode ami" />} />
        <Route path="/simulation" element={<ComingSoon title="Simulation d'entretien" />} />
        <Route path="/quiz" element={<ComingSoon title="Quiz" />} />
        <Route path="/revision-rapide" element={<ComingSoon title="Révision rapide" />} />

        <Route path="/situations/ordre" element={<ComingSoon title="Mises en situation — exercice des réflexes" />} />
        <Route path="/situations" element={<SituationsList />} />
        <Route path="/situations/:id" element={<SituationDetail />} />
        <Route path="/jeux-de-role/:id" element={<RolePlayPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  )
}

export default App
