import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from "../components/layout/MainLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Spinner } from '../components/ui/Spinner';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })));
const ListingsPage = lazy(() => import('../pages/ListingsPage').then((module) => ({ default: module.ListingsPage })));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })));
const CreateListingPage = lazy(() => import('../pages/CreateListingPage').then((module) => ({ default: module.CreateListingPage })));
const EditListingPage = lazy(() => import('../pages/EditListingPage').then((module) => ({ default: module.EditListingPage })));
const ChatPage = lazy(() => import('../pages/ChatPage').then((module) => ({ default: module.ChatPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

const withRouteBoundary = (element) => <ErrorBoundary>{element}</ErrorBoundary>;


export default function AppRouter (){
    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                }
            >
                <Routes>
                    <Route path="/" element={withRouteBoundary(<MainLayout />)}>
                        <Route index element={withRouteBoundary(<HomePage />)} />
                        <Route path="/listings" element={withRouteBoundary(<ListingsPage />)} />
                        <Route path="/listings/:id" element={withRouteBoundary(<ProductDetailPage />)} />
                        <Route element={withRouteBoundary(<AuthLayout />)}>
                            <Route path="/create-listing" element={withRouteBoundary(<CreateListingPage />)} />
                            <Route path="/listings/:id/edit" element={withRouteBoundary(<EditListingPage />)} />
                            <Route path="/chat" element={withRouteBoundary(<ChatPage />)} />
                            <Route path="/profile" element={withRouteBoundary(<ProfilePage />)} />
                        </Route>
                        <Route path="*" element={withRouteBoundary(<NotFoundPage />)} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}