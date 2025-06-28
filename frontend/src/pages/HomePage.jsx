import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Mic,
  Zap,
  Users,
  Shield,
  Clock,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text italic">
              Formify
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 animate-fade-in-delay">
            <button
              onClick={() => scrollToSection("about")}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("industries")}
              className="text-slate-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
            >
              Industries
            </button>
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-slate-600 hover:text-blue-600 transition-colors duration-300 py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left text-slate-600 hover:text-blue-600 transition-colors duration-300 py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("industries")}
                className="block w-full text-left text-slate-600 hover:text-blue-600 transition-colors duration-300 py-2"
              >
                Industries
              </button>
              <div className="flex flex-col gap-3 pt-4 border-t">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 overflow-hidden relative">
        {/* Background Forms */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="container mx-auto px-4 h-full relative">
            {/* Form 1 */}
            <div className="hidden sm:block absolute top-20 left-10 w-32 sm:w-40 md:w-48 h-48 sm:h-56 md:h-64 bg-white rounded-lg shadow-lg transform rotate-[-8deg] hover:scale-110 hover:rotate-[-6deg] transition-all duration-500 opacity-20 hover:opacity-30 pointer-events-auto">
              <div className="p-4 h-full">
                <div className="h-3 bg-blue-100 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-200 rounded w-full"></div>
                  <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-slate-300 rounded"></div>
                    <div className="h-2 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-slate-300 rounded"></div>
                    <div className="h-2 bg-slate-200 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <div className="h-2 bg-blue-200 rounded w-24"></div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form 2 */}
            <div className="hidden sm:block absolute top-32 right-4 sm:right-8 md:right-16 w-36 sm:w-44 md:w-52 h-56 sm:h-64 md:h-72 bg-white rounded-lg shadow-lg transform rotate-[12deg] hover:scale-110 hover:rotate-[10deg] transition-all duration-500 opacity-15 hover:opacity-25 pointer-events-auto">
              <div className="p-4 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <div className="h-3 bg-slate-300 rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  <div className="border-b border-slate-200 pb-1">
                    <div className="h-2 bg-slate-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-blue-100 rounded w-full"></div>
                  </div>
                  <div className="border-b border-slate-200 pb-1">
                    <div className="h-2 bg-slate-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                  </div>
                  <div className="border-b border-slate-200 pb-1">
                    <div className="h-2 bg-slate-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-slate-100 rounded border"></div>
                    <div className="h-8 bg-blue-50 rounded border border-blue-200"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="h-1 bg-slate-200 rounded w-full"></div>
                  <div className="h-1 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-1 bg-slate-200 rounded w-full"></div>
                  <div className="h-1 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Form 3 */}
            <div className="hidden sm:block absolute bottom-20 left-4 sm:left-12 md:left-20 w-32 sm:w-38 md:w-44 h-48 sm:h-54 md:h-60 bg-white rounded-lg shadow-lg transform rotate-[6deg] hover:scale-110 hover:rotate-[4deg] transition-all duration-500 opacity-20 hover:opacity-30 pointer-events-auto">
              <div className="p-4 h-full">
                <div className="border-b-2 border-blue-600 pb-2 mb-4">
                  <div className="h-2 bg-blue-600 rounded w-1/2"></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <div className="h-2 bg-slate-200 rounded w-16"></div>
                    </div>
                    <div className="ml-3 h-2 bg-slate-100 rounded w-full"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <div className="h-2 bg-slate-200 rounded w-20"></div>
                    </div>
                    <div className="ml-3 h-2 bg-blue-100 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="h-2 bg-blue-200 rounded w-18"></div>
                    </div>
                    <div className="ml-3 h-2 bg-slate-100 rounded w-4/5"></div>
                  </div>
                </div>
                <div className="mt-6 p-2 bg-slate-50 rounded border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <div className="w-6 h-6 bg-slate-300 rounded mx-auto mb-1"></div>
                    <div className="h-1 bg-slate-300 rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-4 bg-blue-100 text-blue-800 border-blue-200 animate-bounce-in text-xs sm:text-sm"
          >
            Voice-Powered Form Filling
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-up">
            Transform Speech into
            <span className="text-blue-600 block animate-fade-up-delay">
              Structured Data
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-up-delay-2 px-4">
            Formify streamlines form-filling by converting speech to text in
            real time. Eliminate manual data entry and connect more deeply with
            your clients through focused, genuine conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-up-delay-3 px-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-all duration-300 group"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 hover:scale-105 transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500 animate-fade-up-delay-4 px-4">
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Real-time processing</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>HIPAA compliant</span>
            </div>
          </div>

          {/* Signature Animation */}
          <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 md:bottom-16 md:right-16 pointer-events-none z-20">
            <div className="signature-container">
              {/* Text that gets written out */}
              <div className="signature-text-wrapper">
                <span className="signature-text">Formify</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-slide-right order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Eliminate Manual Data Entry Forever
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
                Formify transforms tedious, manual form-filling and helps
                professionals connect more deeply with their clients through
                focused and genuine conversations that truly capture every
                detail.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3 animate-fade-in-up group">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      Real-Time Audio Analysis
                    </h3>
                    <p className="text-slate-600">
                      Advanced algorithms process speech patterns and context in
                      real-time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 animate-fade-in-up-delay group">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      Structured Data Mapping
                    </h3>
                    <p className="text-slate-600">
                      Intelligent field mapping ensures information goes exactly
                      where it belongs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 animate-fade-in-up-delay-2 group">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      Effortless Client Interactions
                    </h3>
                    <p className="text-slate-600">
                      Focus on your clients while technology handles the
                      paperwork
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-4 sm:p-6 lg:p-12 animate-slide-left order-1 lg:order-2">
              <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-500">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Mic className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-blue-200 rounded-full">
                      <div className="h-1.5 sm:h-2 bg-blue-600 rounded-full w-3/4 animate-pulse-wave"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Form Title */}
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      Form Title
                    </h3>
                    <h4 className="text-blue-600 font-medium">John's Form</h4>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <div className="border border-slate-200 rounded p-3 h-10 flex items-center bg-slate-50 relative">
                      <span className="text-sm text-slate-700 animate-typing-1 overflow-hidden whitespace-nowrap">
                        John Smith
                      </span>
                      <div
                        className="w-0.5 h-4 bg-blue-600 animate-cursor-1 absolute"
                        style={{ left: "calc(12px + 0ch)" }}
                      ></div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="border border-slate-200 rounded p-3 h-10 flex items-center bg-slate-50 relative">
                      <span className="text-sm text-slate-700 animate-typing-2 overflow-hidden whitespace-nowrap">
                        john.smith@company.com
                      </span>
                      <div
                        className="w-0.5 h-4 bg-blue-600 animate-cursor-2 absolute"
                        style={{ left: "calc(12px + 0ch)" }}
                      ></div>
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <div className="border border-slate-200 rounded p-3 h-10 flex items-center bg-slate-50 relative">
                      <span className="text-sm text-slate-700 animate-typing-3 overflow-hidden whitespace-nowrap">
                        (555) 123-4567
                      </span>
                      <div
                        className="w-0.5 h-4 bg-blue-600 animate-cursor-3 absolute"
                        style={{ left: "calc(12px + 0ch)" }}
                      ></div>
                    </div>
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Address
                    </label>
                    <div className="border border-slate-200 rounded p-3 h-10 flex items-center bg-slate-50 relative">
                      <span className="text-sm text-slate-700 animate-typing-4 overflow-hidden whitespace-nowrap">
                        123 Main Street, New York, NY
                      </span>
                      <div
                        className="w-0.5 h-4 bg-blue-600 animate-cursor-4 absolute"
                        style={{ left: "calc(12px + 0ch)" }}
                      ></div>
                    </div>
                  </div>

                  {/* Occupation Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Occupation
                    </label>
                    <div className="border border-slate-200 rounded p-3 h-10 flex items-center justify-between bg-slate-50 relative">
                      <span className="text-sm text-slate-700 animate-typing-5 overflow-hidden whitespace-nowrap">
                        Healthcare Professional
                      </span>
                      <div
                        className="w-0.5 h-4 bg-blue-600 animate-cursor-5 absolute"
                        style={{ left: "calc(12px + 0ch)" }}
                      ></div>
                      <div className="w-3 h-3 border-l border-b border-slate-400 transform rotate-[-45deg]"></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 mt-6 border-t border-slate-200">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200">
                      Save as PDF
                    </button>
                    <button className="flex-1 border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium py-2 px-4 rounded transition-colors duration-200">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Modern Professionals
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Advanced technology that transforms how you capture and structure
              client information
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up group">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                  Real-Time Speech Recognition
                </CardTitle>
                <CardDescription>
                  Advanced voice processing converts natural speech to
                  structured text instantly
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up-delay group">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                  WebSocket Integration
                </CardTitle>
                <CardDescription>
                  Lightning-fast real-time connections ensure seamless data flow
                  and instant updates
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up-delay-2 group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                  Natural Dialogue Mapping
                </CardTitle>
                <CardDescription>
                  Intelligent algorithms map conversational speech into
                  structured form fields automatically
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up-delay-3 group">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                  Client-Focused Interactions
                </CardTitle>
                <CardDescription>
                  Maintain eye contact and genuine connections while forms fill
                  themselves
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up-delay-4 group">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                  Enterprise Security
                </CardTitle>
                <CardDescription>
                  HIPAA compliant with end-to-end encryption for sensitive
                  professional data
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up-delay-5 group">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
                  Custom Form Builder
                </CardTitle>
                <CardDescription>
                  Create tailored forms for any industry with drag-and-drop
                  simplicity
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-16 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 animate-fade-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trusted by Professionals Across Industries
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              From healthcare to finance, Formify adapts to your industry's
              unique needs
            </p>
          </div>

          {/* Stacked Papers - Card Spread Layout */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[320px] sm:max-w-[480px] md:max-w-[600px] h-64 sm:h-80 md:h-96 group">
              {/* Legal Paper */}
              <div className="absolute top-10 left-0 w-64 h-80 bg-white rounded-lg shadow-xl border border-slate-200 transform rotate-[-15deg] transition-all duration-500 ease-out legal-paper cursor-pointer z-10">
                <div className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Legal
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">
                    Client intake, case documentation, and consultation records
                    with security
                  </p>
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded-lg p-2 mb-4">
                      <div className="h-2 bg-orange-600 rounded w-1/3"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-orange-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                    <div className="mt-4 p-2 bg-orange-50 rounded-lg">
                      <div className="text-center">
                        <div className="w-4 h-4 bg-orange-300 rounded mx-auto mb-1"></div>
                        <div className="h-1 bg-orange-300 rounded w-12 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Paper */}
              <div className="absolute top-10 left-[140px] w-64 h-80 bg-white rounded-lg shadow-xl border border-slate-200 transform rotate-[-5deg] transition-all duration-500 ease-out education-paper cursor-pointer z-20">
                <div className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Education
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">
                    Student assessments, parent conferences, and administrative
                    documentation
                  </p>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-purple-200 rounded w-4/5"></div>
                    <div className="h-2 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <div className="h-2 bg-purple-200 rounded w-16"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <div className="h-2 bg-slate-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance Paper */}
              <div className="absolute top-10 left-[280px] w-64 h-80 bg-white rounded-lg shadow-xl border border-slate-200 transform rotate-[5deg] transition-all duration-500 ease-out finance-paper cursor-pointer z-30">
                <div className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Finance
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">
                    Client onboarding, risk assessments, and financial planning
                    documentation
                  </p>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-green-200 rounded w-2/3"></div>
                    <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/3"></div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="h-6 bg-green-100 rounded shadow-sm"></div>
                      <div className="h-6 bg-slate-100 rounded shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Healthcare Paper */}
              <div className="absolute top-10 left-[420px] w-64 h-80 bg-white rounded-lg shadow-xl border border-slate-200 transform rotate-[15deg] transition-all duration-500 ease-out healthcare-paper cursor-pointer z-40">
                <div className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Healthcare
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-6">
                    Patient intake, medical histories, and consultation notes
                    with HIPAA compliance
                  </p>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-cyan-200 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-cyan-600 rounded"></div>
                      <div className="h-2 bg-cyan-200 rounded w-24"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-200 rounded"></div>
                      <div className="h-2 bg-slate-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center animate-fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Form-Filling Process?
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto px-4">
            Join thousands of professionals who have eliminated manual data
            entry and improved client relationships with Formify.
          </p>
          <div className="max-w-md mx-auto mb-8 animate-slide-up px-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm text-slate-500 animate-fade-up-delay px-4">
            <span className="hover:text-blue-600 transition-colors duration-300">
              ✓ 14-day free trial
            </span>
            <span className="hover:text-blue-600 transition-colors duration-300">
              ✓ No setup fees
            </span>
            <span className="hover:text-blue-600 transition-colors duration-300">
              ✓ Cancel anytime
            </span>
            <span className="hover:text-blue-600 transition-colors duration-300">
              ✓ 24/7 support
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12 animate-slide-up">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text italic">
                  Formify
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                Voice-powered form filling for modern professionals.
              </p>
            </div>
            <div className="animate-fade-in-delay">
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-delay-2">
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="animate-fade-in-delay-3">
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center animate-fade-up">
            <p className="text-slate-400 text-sm">
              © 2025 Formify. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-slate-400 mt-4 md:mt-0">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 text-center sm:text-left"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 text-center sm:text-left"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors duration-300 text-center sm:text-left"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
