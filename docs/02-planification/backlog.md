# Backlog produit - Lebontroc

Priorisation MoSCoW. Format : *En tant que [rôle], je veux [action] afin de [bénéfice].*

## Must Have

| ID | User Story | Critères d'acceptation |
|----|-----------|------------------------|
| US-001 | En tant que visiteur, je veux m'inscrire avec un email, un mot de passe et un numéro de téléphone afin de créer un compte sur la plateforme. | Le compte est créé après vérification du numéro de téléphone, 1h est créditée automatiquement, l'utilisateur est redirigé vers son profil. |
| US-002 | En tant que visiteur, je veux vérifier mon numéro de téléphone par code WhatsApp afin de valider mon inscription. | Un code est envoyé sur WhatsApp, le compte est activé uniquement après saisie du bon code. |
| US-003 | En tant qu'utilisateur, je veux me connecter afin d'accéder à mon espace personnel. | La session est active, le tableau de bord avec le solde s'affiche. |
| US-004 | En tant qu'utilisateur, je veux voir mon solde d'heures sur mon tableau de bord afin de savoir ce que j'ai à disposition. | Le solde est affiché et se met à jour après chaque transaction. |
| US-005 | En tant que nouvel inscrit, je veux recevoir 1h de crédit automatiquement après vérification de mon numéro afin de pouvoir faire mes premiers échanges. | Le solde est à 1h après activation du compte. |
| US-006 | En tant qu'utilisateur, je veux renseigner mon profil (photo, description, services proposés et recherchés) afin de me présenter aux autres membres. | Le profil est modifiable, la photo peut être changée, les informations sont visibles par les autres. |
| US-007 | En tant qu'utilisateur, je veux publier une annonce avec un titre, une description, une durée estimée, une catégorie et un code postal afin de proposer mon service. | L'annonce apparaît dans la liste après publication. |
| US-008 | En tant qu'utilisateur, je veux consulter la liste des annonces afin de trouver un service qui m'intéresse. | La liste s'affiche avec les informations principales de chaque annonce. |
| US-009 | En tant qu'utilisateur, je veux filtrer les annonces par catégorie afin de trouver plus facilement ce que je cherche. | Le filtre fonctionne et les résultats correspondent à la catégorie choisie. |
| US-010 | En tant qu'utilisateur, je veux filtrer les annonces par code postal afin de trouver des services près de chez moi. | Seules les annonces du code postal saisi s'affichent. |
| US-011 | En tant qu'utilisateur, je veux modifier ou supprimer mes annonces afin de les maintenir à jour. | Seul le créateur de l'annonce peut la modifier ou la supprimer. |
| US-012 | En tant que prestataire, je veux accepter ou refuser une demande de service afin de garder le contrôle sur mes engagements. | Si je refuse, la transaction passe en "Annulée" et aucune heure ne bouge. Si je l'accepte, elle reste "Ouverte" et j'irai la valider une fois le service rendu. |
| US-013 | En tant que bénéficiaire, je veux confirmer qu'un service m'a été rendu afin de valider l'échange de mon côté. | Ma validation est enregistrée. Si le prestataire n'a pas encore validé, la transaction reste en attente. |
| US-014 | En tant que prestataire, je veux confirmer que j'ai rendu le service afin de recevoir mes heures. | Une fois les deux validations faites, la transaction est finalisée et les heures sont transférées. |
| US-015 | En tant qu'utilisateur, je veux consulter l'historique de mes transactions afin de suivre mes échanges passés. | La liste des transactions avec leur état et leur durée est accessible depuis mon profil. |
| US-016 | En tant que système, je dois empêcher un utilisateur d'être à la fois prestataire et bénéficiaire d'une même transaction afin d'éviter la triche. | Un message d'erreur s'affiche si quelqu'un tente de s'auto-échanger. |

## Should Have

| ID | User Story | Critères d'acceptation |
|----|-----------|------------------------|
| US-017 | En tant qu'utilisateur intéressé par une annonce, je veux envoyer un message au publieur afin d'organiser l'échange. | Le message est envoyé et visible dans la conversation. |
| US-018 | En tant qu'utilisateur, je veux consulter mes conversations afin de suivre mes échanges en cours. | La liste des conversations s'affiche avec le dernier message et le nom de l'interlocuteur. |
| US-019 | En tant que prestataire, je veux répondre aux messages reçus afin de discuter des modalités avec le bénéficiaire. | La réponse est visible dans la conversation. |
| US-020 | En tant qu'utilisateur, je veux annuler une transaction en cours afin de me désengager avant qu'elle soit finalisée. | La transaction passe en "Annulée" et aucune heure n'est débitée ni créditée. |

## Could Have

| ID | User Story | Critères d'acceptation |
|----|-----------|------------------------|
| US-021 | En tant que bénéficiaire, je veux noter le prestataire après un échange (note de 1 à 5 et commentaire) afin de contribuer à sa réputation. | La note est enregistrée et visible sur le profil du prestataire. |
| US-022 | En tant que prestataire, je veux noter le bénéficiaire après un échange afin de contribuer à sa réputation. | La note est enregistrée et visible sur le profil du bénéficiaire. |
| US-023 | En tant qu'utilisateur, je veux voir la note moyenne d'un autre membre sur son profil afin d'évaluer sa fiabilité avant d'échanger. | La moyenne et le nombre d'avis sont affichés sur le profil. |

## Won't Have

- Géolocalisation GPS ou carte interactive
- Messagerie en temps réel
- Paiement réel
- Interface d'administration ou de modération
- Notifications par email ou push

*23 user stories au total. Les Must Have (F1, F2 et F4) forment le minimum démontrable.*

*Lebontroc - Projet ALM M2 HESIAS - 2025-2026*
