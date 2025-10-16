package com.prodemy.model;

import com.fasterxml.jackson.annotation.JsonProperty;


import javax.persistence.*;

@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("quizTitle")
    private String quizTitle;

    @JsonProperty("quizDescription")
    private String quizDescription;

    @JsonProperty("quizAuthor")
    private String quizAuthor;

    @JsonProperty("quizCategory")
    private String quizCategory;

    @JsonProperty("quizContent")
    @Lob
    private String quizContent;

    // Constructors
    public Quiz() {}

    public Quiz(String quizTitle, String quizDescription, String quizAuthor, String quizCategory, String quizContent) {
        this.quizTitle = quizTitle;
        this.quizDescription = quizDescription;
        this.quizAuthor = quizAuthor;
        this.quizCategory = quizCategory;
        this.quizContent = quizContent;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }

    public String getQuizDescription() { return quizDescription; }
    public void setQuizDescription(String quizDescription) { this.quizDescription = quizDescription; }

    public String getQuizAuthor() { return quizAuthor; }
    public void setQuizAuthor(String quizAuthor) { this.quizAuthor = quizAuthor; }

    public String getQuizCategory() { return quizCategory; }
    public void setQuizCategory(String quizCategory) { this.quizCategory = quizCategory; }

    public String getQuizContent() { return quizContent; }
    public void setQuizContent(String quizContent) { this.quizContent = quizContent; }
}
